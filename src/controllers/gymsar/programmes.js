// Route manager for /gymsar/programmes
// Data folder: gys

// Dependencies
const router = require('express').Router()
const fs = require('fs')
const path = require('path')
const { parseString } = require('xml2js')

// Helpers
const formatter = require('../../helpers/gymsar/formatter')
const latinize = require('../../helpers/latinize')

const rootPath = path.resolve(__dirname + '/../../../files/gys')

router.get('/', (req, res) => {
  const file = rootPath + '/programsAndOrientations/Program_och_inriktningar.xml'

  parseString(fs.readFileSync(file).toString(), (err, result) => {
    const programmeList = []
    result.ProgramsAndOrientations.program.forEach(programme => {
      programmeList.push({
        name: programme.name[0],
        code: programme.code[0]
      })
    })

    res.json(programmeList)
  })
})

router.get('/:code', (req, res) => {
  const programmeFile = rootPath + '/programsAndOrientations/Program_och_inriktningar.xml'
  const code = req.params.code.toLowerCase()

  parseString(fs.readFileSync(programmeFile).toString(), (err, result) => {
    let validCode = false

    result.ProgramsAndOrientations.program.forEach(data => {
      if (data.code[0].toLowerCase() === code) {
        validCode = true

        let file = rootPath + '/program/' + latinize(data.name[0]) + '.xml'
        while (file.indexOf('–') > -1) {
          file = file.replace('–', '-')
        }

        parseString(fs.readFileSync(file).toString(), (err, result) => {
          res.json(formatter.formatProgramme(result.program))
        })
      }
    })

    if (!validCode) res.status(404).send('Not found')
  })
})

module.exports = router
