// Route manager for /gru/subjects
// Data folder: compulsory

// Dependencies
const router = require('express').Router()
const path = require('path')
const fs = require('fs')
const async = require('async')
const { parseString } = require('xml2js')

// Helpers
const formatter = require('../../helpers/gru/formatter')

const rootPath = path.resolve(__dirname + '/../../../files/compulsory')

router.get('/', (req, res) => {
  const rootFolders = fs.readdirSync(rootPath)
  let folderName
  rootFolders.forEach(folder => {
    if (folder.indexOf('subject') > -1) folderName = folder
  })
  if (!folderName) return res.json([])

  const levels = fs.readdirSync(rootPath + '/' + folderName)
  res.json(levels)
})

router.get('/:level', (req, res) => {
  const rootFolders = fs.readdirSync(rootPath)
  let folderName
  rootFolders.forEach(folder => {
    if (folder.indexOf('subject') > -1) folderName = folder
  })
  if (!folderName) return res.json([])

  if (fs.existsSync(rootPath + '/' + folderName + '/' + req.params.level)) {
    const subjectDir = rootPath + '/' + folderName + '/' + req.params.level
    const subjectList = fs.readdirSync(subjectDir)

    let subjects = []
    async.each(subjectList, (subject, callback) => {
      parseString(fs.readFileSync(subjectDir + '/' + subject), (err, result) => {
        if (err) return callback(error)

        subjects.push({
          name: result.subject.name[0],
          code: result.subject.code[0]
        })
        callback()
      })
    }, (error) => {
      if (error) {
        console.log(error)
        return res.status(500).send('Something went wrong.')
      }

      subjects.sort((a, b) => {
        if (a.name > b.name) return 1
        if (a.name < b.name) return -1
        return 0
      })
      res.json(subjects)
    })
  } else {
    res.status(404).send('Not found.')
  }
})

router.get('/:level/:code', (req, res) => {
  const rootFolders = fs.readdirSync(rootPath)
  let folderName
  rootFolders.forEach(folder => {
    if (folder.indexOf('subject') > -1) folderName = folder
  })
  if (!folderName) return res.json([])

  if (fs.existsSync(rootPath + '/' + folderName + '/' + req.params.level)) {
    const subjectDir = rootPath + '/' + folderName + '/' + req.params.level
    const subjectList = fs.readdirSync(subjectDir)

    const code = req.params.code.toLowerCase()
    let subject
    async.each(subjectList, (subjectName, callback) => {
      if (!subject) {
        parseString(fs.readFileSync(subjectDir + '/' + subjectName), (err, result) => {
          if (err) return callback(err)
          if (result.subject.code[0].toLowerCase() === code) {
            subject = formatter.formatSubject(result.subject)
          }
          callback()
        })
      } else {
        callback()
      }
    }, (error) => {
      if (error) {
        console.log(error)
        return res.status(500).send('Something went wrong.')
      }
      if (!subject) return res.status(404).send('Not found.')

      res.json(subject)
    })
  } else {
    res.status(404).send('Not found.')
  }
})

module.exports = router
