// Route manager for /sfi/subjects
// Data folder: sfi

// Dependencies
const router = require('express').Router()
const path = require('path')
const fs = require('fs')
const { parseString } = require('xml2js')

// Helpers
const formatter = require('../../helpers/sfi/formatter')
const latinize = require('../../helpers/latinize')

const rootPath = path.resolve(__dirname + '/../../../files/sfi')

router.get('/', (req, res) => {
  const file = rootPath + '/subjectsAndCourses/amnen_och_kurser.xml'

  parseString(fs.readFileSync(file).toString(), (err, result) => {
    res.json(formatter.formatSubjects(result.SubjectsAndCourses.subject))
  })
})

router.get('/:code', (req, res) => {
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
          res.json(formatter.formatSubjectData(result.subject))
        })
      }
    })

    if (!validCode) res.status(404).send('Not found.')
  })
})

module.exports = router
