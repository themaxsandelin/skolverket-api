// Route manager for: /gym/orientations
// Data folder: syllabus

// Dependencies
const router = require('express').Router()
const path = require('path')
const fs = require('fs')
const { parseString } = require('xml2js')

// Helpers
const formatter = require('../../helpers/formatter')
const latinize = require('../../helpers/latinize')

const rootPath = path.resolve(__dirname + '/../../../files/syllabus')

router.get('/', (req, res) => {
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

router.get('/:code', (req, res) => {
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

module.exports = router
