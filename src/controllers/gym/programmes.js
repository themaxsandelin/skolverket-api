// Route manager for: /gym/programmes
// Data folder: syllabus

// Dependencies
const router = require('express').Router()
const path = require('path')
const fs = require('fs')
const { parseString } = require('xml2js')

// Helpers
const formatter = require('../../helpers/gym/formatter')
const latinize = require('../../helpers/latinize')

const rootPath = path.resolve(__dirname + '/../../../files/syllabus')

router.get('/', (req, res) => {
  const file = rootPath + '/programsAndOrientations/Program_och_inriktningar.xml'
  const fourthTechYearExists = fs.existsSync(rootPath + '/Gymnasieingenjor.xml')

  parseString(fs.readFileSync(file).toString(), (err, result) => {
    const programs = []
    result.ProgramsAndOrientations.program.forEach(program => {
      const orientations = []
      if (program.orientaions) {
        program.orientaions.forEach(orientation => {
          orientations.push({
            name: orientation.name[0],
            code: orientation.code[0]
          })
        })
      } else if (program.orientations) {
        program.orientations.forEach(orientation => {
          orientations.push({
            name: orientation.name[0],
            code: orientation.code[0]
          })
        })
      }

      programs.push({
        name: program.name[0],
        code: program.code[0],
        orientations: orientations
      })
    })

    if (fourthTechYearExists) {
      parseString(fs.readFileSync(rootPath + '/Gymnasieingenjor.xml').toString(), (err, result) => {
        const program = result.fourthTechnicalYear
        programs.push({
          name: program.name[0],
          code: program.code[0],
          orientaions: []
        })

        programs.sort((a, b) => {
          if (a.code > b.code) return 1
          if (a.code < b.code) return -1
          return 0
        })

        res.json(programs)
      })
    } else {
      res.json(programs)
    }
  })
})

router.get('/:code', (req, res) => {
  const code = req.params.code.toLowerCase()
  const file = rootPath + '/programsAndOrientations/Program_och_inriktningar.xml'
  const fourthTechYear = fs.existsSync(rootPath + '/Gymnasieingenjor.xml') ? rootPath + '/Gymnasieingenjor.xml' : ''

  let validCode = false
  if (code === 'vi001') {
    validCode = true
    parseString(fs.readFileSync(fourthTechYear).toString(), (err, result) => {
      res.json( formatter.formatProgramme(result.fourthTechnicalYear) )
    })
  } else {
    parseString(fs.readFileSync(file).toString(), (err, result) => {
      result.ProgramsAndOrientations.program.forEach(progr => {
        if (progr.code[0].toLowerCase() === code) {
          validCode = true
          const programme = progr
          // Construct file name based on the name of the programme.
          let file = rootPath + '/program/' + latinize(progr.name[0]) + '.xml'
          while (file.indexOf('–') > -1) {
            file = file.replace('–', '-')
          }
          // Read the programme specific XML file to get it's data.
          parseString(fs.readFileSync(file), (err, result) => {
            const data = result.program

            const programme = {
              name: data.name[0],
              code: data.code[0],
              skolfs: data.skolfsId[0],
              applianceDate: data.applianceDate[0],
              typeOfSchooling: data.typeOfSchooling[0],
              typeOfProgram: data.typeOfProgram[0],
              generalSubjects: [],
              programmeSubjects: [],
              specializationSubjects: [],
              orientations: [],
              profiles: [],
              individualChoice: [],
              projectAssignments: [],
              professionalDegrees: []
            }

            // Go through "commonMandatory" to get all general subjects.
            if (data.commonMandatory[0] !== '') {
              programme.generalSubjects = formatter.formatSubjects(data.commonMandatory[0].subject)
            }

            // Go through "commonProgram" to get all programme specific subjects.
            if (data.commonProgram[0] !== '') {
              programme.programmeSubjects = formatter.formatSubjects(data.commonProgram[0].subject)
            }

            // Go through all "programOrientations" to get programme orientations.
            if (data.programOrientations[0] !== '') {
              data.programOrientations[0].programOrientation.forEach(orientationData => {
                const orientation = {
                  name: orientationData.name[0],
                  code: orientationData.code[0],
                  points: parseInt(orientationData.point[0]),
                  subjects: (orientationData.subject[0] !== '') ? formatter.formatSubjects(orientationData.subject) : []
                }
                programme.orientations.push(orientation)
              })
            }

            if (data.specialization[0] !== '') {
              programme.specializationSubjects = formatter.formatSubjects(data.specialization[0].subject)
            }

            // Go through "professionalDegrees"
            if (data.professionalDegrees[0] !== '') {
              data.professionalDegrees[0].professionalDegree.forEach(degreeData => {
                const degree = {
                  name: degreeData.name[0],
                  code: degreeData.programOrientationCode[0],
                  subjects: (degreeData.subject && degreeData.subject[0] !== '') ? formatter.formatSubjects(degreeData.subject) : []
                }

                programme.professionalDegrees.push(degree)
              })
            }

            // Go through "projectAssignments"
            if (data.projectAssignment[0] !== '') {
              data.projectAssignment[0].subject.forEach(subjectData => {
                programme.projectAssignments.push({
                  name: subjectData.name[0],
                  code: subjectData.code[0],
                  optional: subjectData.optional[0] === 'true' ? true : false,
                  alias: subjectData.alias[0] === 'true' ? true : false
                })
              })
            }

            // Go through "profiles"
            if (data.profiles[0] !== '') {
              programme.profiles = formatter.formatProfiles(data.profiles.profile)
            }

            res.json(formatter.formatProgramme(data))
          })
        }
      })
      if (!validCode) res.status(404).send('Not found.')
    })
  }
})

module.exports = router
