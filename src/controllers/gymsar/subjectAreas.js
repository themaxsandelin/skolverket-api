// Route manager for: /gymsar/subject-areas
// Data folder: gys

// Dependencies
const router = require('express').Router()
const path = require('path')
const fs = require('fs')
const { parseString } = require('xml2js')
const async = require('async')

// Helpers
const formatter = require('../../helpers/gymsar/formatter')
const latinize = require('../../helpers/latinize')

const rootPath = path.resolve(__dirname + '/../../../files/gys')

router.get('/', (req, res) => {
  const folder = rootPath + '/subjectArea'
  const files = fs.readdirSync(folder)

  let areas = []
  async.each(files, (file, callback) => {
    parseString(fs.readFileSync(folder + '/' + file), (err, result) => {
      areas.push({
        name: result.subject.name[0],
        code: result.subject.code[0]
      })

      callback()
    })
  }, (error) => {
    res.json(areas)
  })
})

router.get('/:code', (req, res) => {
  const code = req.params.code.toLowerCase()
  const folder = rootPath + '/subjectArea'
  const files = fs.readdirSync(folder)

  let area
  async.each(files, (file, callback) => {
    parseString(fs.readFileSync(folder + '/' + file), (err, result) => {
      if (result.subject.code[0].toLowerCase() === code) {
        const data = result.subject
        area = formatter.formatSubjectData(result.subject)
      }

      callback()
    })
  }, (error) => {
    if (area) {
      res.json(area)
    } else {
      res.status(404).send('Not found')
    }
  })
})

module.exports = router
