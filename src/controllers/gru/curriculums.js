// Route manager for /gru/curriculums
// Data folder: compulsory

// Dependencies
const router = require('express').Router()
const fs = require('fs')
const path = require('path')
const { parseString } = require('xml2js')

// Helpers
const formatter = require('../../helpers/gru/formatter')

const rootPath = path.resolve(__dirname + '/../../../files/compulsory')

router.get('/', (req, res) => {
  const rootFolders = fs.readdirSync(rootPath)
  let folderName
  rootFolders.forEach(folder => {
    if (folder.indexOf('curriculum') > -1) folderName = folder
  })
  if (!folderName) return res.json([])

  const curriculumFiles = fs.readdirSync(rootPath + '/' + folderName)
  let curriculums = []
  curriculumFiles.forEach(fileName => {
    curriculums.push(fileName.replace('-laroplan.xml', ''))
  })
  res.json(curriculums)
})

router.get('/:level', (req, res) => {
  const rootFolders = fs.readdirSync(rootPath)
  let folderName
  rootFolders.forEach(folder => {
    if (folder.indexOf('curriculum') > -1) folderName = folder
  })
  if (!folderName) return res.json([])

  const fileName = req.params.level + '-laroplan.xml'
  const filePath = rootPath + '/' + folderName + '/' + fileName
  if (fs.existsSync(filePath)) {
    parseString(fs.readFileSync(filePath).toString(), (err, result) => {
      res.json(formatter.formatCurriculum(result.Curriculum))
    })
  }
})

module.exports = router
