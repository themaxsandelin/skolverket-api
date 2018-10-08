// Route manager for: /gym
// Data folder: syllabus

// Dependencies
const router = require('express').Router()
const { parseString } = require('xml2js')
const fs = require('fs')
const path = require('path')
const Turndown = require('turndown')

// Helpers
const latinize = require('../helpers/latinize')
const formatter = require('../helpers/formatter')

const rootPath = path.resolve(__dirname + '/../../files/syllabus')

router.get('/', (req, res) => {
  res.json({
    level: 'Gymnasieskolan och komvux gymnasial',
    routes: [ '/programmes', '/programmes/[code]', '/orientations', '/orientations/[code]', '/subjects', '/subjects/[code]', '/courses', '/courses/[code]']
  })
})

router.get('/programmes', (req, res) => {
  const file = rootPath + '/programsAndOrientations/Program_och_inriktningar.xml'

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

    res.json(programs)
  })
})

router.get('/programmes/:code', (req, res) => {
  const code = req.params.code.toLowerCase()
  const file = rootPath + '/programsAndOrientations/Program_och_inriktningar.xml'

  parseString(fs.readFileSync(file).toString(), (err, result) => {
    let validCode = false
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

          res.json(programme)
        })
      }
    })

    if (!validCode) res.status(404).send('Not found.')
  })
})

router.get('/orientations', (req, res) => {
  const file = rootPath + '/programsAndOrientations/Program_och_inriktningar.xml'
  parseString(fs.readFileSync(file).toString(), (err, result) => {
    const orientations = []

    result.ProgramsAndOrientations.program.forEach(programme => {
      let programmeOrientations = []
      if (programme.orientations) programmeOrientations = programme.orientations
      if (programme.orientaions) programmeOrientations = programme.orientaions

      programmeOrientations.forEach(orientation => {
        orientations.push({
          name: orientation.name[0],
          code: orientation.code[0]
        })
      })
    })

    res.json(orientations)
  })
})

router.get('/orientations/:code', (req, res) => {
  const code = req.params.code.toLowerCase()
  const file = rootPath + '/programsAndOrientations/Program_och_inriktningar.xml'

  parseString(fs.readFileSync(file).toString(), (err, result) => {
    let validCode = false
    result.ProgramsAndOrientations.program.forEach(progr => {
      if (progr.orientaions) {
        progr.orientaions.forEach(orientation => {
          if (orientation.code[0].toLowerCase() === code) {
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
              data.programOrientations[0].programOrientation.forEach(orData => {
                if (orData.code[0].toLowerCase() === code) {
                  const orientation = {
                    name: orData.name[0],
                    code: orData.code[0],
                    points: parseInt(orData.point[0]),
                    subjects: (orData.subject[0] !== '') ? formatter.formatSubjects(orData.subject) : []
                  }

                  res.json(orientation)
                }
              })
            })
          }
        })
      }
    })

    if (!validCode) res.status(404).send('Not found.')
  })
})

router.get('/subjects', (req, res) => {
  const file = rootPath + '/subjectsAndCourses/amnen_och_kurser.xml'

  parseString(fs.readFileSync(file).toString(), (err, result) => {
    const subjects = formatter.formatSubjects(result.SubjectsAndCourses.subject)

    res.json(subjects)
  })
})

router.get('/subjects/:code', (req, res) => {
  const code = req.params.code.toLowerCase()
  const file = rootPath + '/subjectsAndCourses/amnen_och_kurser.xml'

  parseString(fs.readFileSync(file).toString(), (err, result) => {
    let validCode = false
    result.SubjectsAndCourses.subject.forEach(subject => {
      if (subject.code[0].toLowerCase() === code) {
        validCode = true

        let file = rootPath + '/subject/' + latinize(subject.name[0]) + '.xml'
        while (file.indexOf('–') > -1) {
          file = file.replace('–', '-')
        }

        parseString(fs.readFileSync(file), (err, result) => {
          const turndownService = new Turndown()
          const data = result.subject
          const subject = {
            name: data.name[0],
            code: data.code[0],
            skolfs: data.skolfsId[0],
            applianceDate: data.applianceDate[0],
            typeOfSchooling: data.typeOfSchooling[0],
            category: data.category[0],
            description: turndownService.turndown(data.description[0]),
            purpose: turndownService.turndown(data.purpose[0]),
            courses: formatter.formatCourses(data.courses)
          }

          res.json(subject)
        })
      }
    })

    if (!validCode) res.status(404).send('Not found.')
  })
})

router.get('/courses', (req, res) => {
  const file = rootPath + '/subjectsAndCourses/amnen_och_kurser.xml'

  parseString(fs.readFileSync(file).toString(), (err, result) => {
    const courses = []

    result.SubjectsAndCourses.subject.forEach(subject => {
      if (subject.courses) {
        subject.courses.forEach(course => {
          courses.push({
            name: course.name[0],
            code: course.code[0]
          })
        })
      }
    })

    res.json(courses)
  })
})

router.get('/courses/:code', (req, res) => {
  const code = req.params.code.toLowerCase()
  const file = rootPath + '/subjectsAndCourses/amnen_och_kurser.xml'

  parseString(fs.readFileSync(file).toString(), (err, result) => {
    let validCode = false
    result.SubjectsAndCourses.subject.forEach(subject => {
      if (subject.courses) {
        subject.courses.forEach(course => {
          if (course.code[0].toLowerCase() === code) {
            validCode = true

            let file = rootPath + '/subject/' + latinize(subject.name[0]) + '.xml'
            while (file.indexOf('–') > -1) {
              file = file.replace('–', '-')
            }

            parseString(fs.readFileSync(file), (err, result) => {
              result.subject.courses.forEach(courseData => {
                if (courseData.code[0].toLowerCase() === code) {
                  // const knowledgeRequirements = []
                  // courseData.knowledgeRequirements.forEach(knowReq => {
                  //   knowledgeRequirements.push({
                  //     grade: knowReq.gradeStep[0],
                  //     requirement: knowReq.text[0]
                  //   })
                  // })

                  res.json(formatter.formatCourseData(courseData))
                }
              })
            })
          }
        })
      }
    })

    if (!validCode) res.status(404).send('Not found.')
  })
})

module.exports = router
