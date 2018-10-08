// Route manager for: /gym/subjects
// Data folder: syllabus

// Dependencies
const router = require('express').Router()
const path = require('path')
const fs = require('fs')
const { parseString } = require('xml2js')
const Turndown = require('turndown')

// Helpers
const formatter = require('../../helpers/formatter')
const latinize = require('../../helpers/latinize')

const rootPath = path.resolve(__dirname + '/../../../files/syllabus')

router.get('/', (req, res) => {
  const file = rootPath + '/subjectsAndCourses/amnen_och_kurser.xml'

  parseString(fs.readFileSync(file).toString(), (err, result) => {
    const subjects = formatter.formatSubjects(result.SubjectsAndCourses.subject)

    res.json(subjects)
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

module.exports = router
