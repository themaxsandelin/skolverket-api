const fs = require('fs')
const path = require('path')
const { parseString } = require('xml2js')
const latinize = require('./helpers/latinize')

const filesDir = path.resolve(__dirname + '/../files')
const subjectsFile = filesDir + '/subjectsAndCourses/amnen_och_kurser.xml'
const subjectsXML = fs.readFileSync(subjectsFile).toString()

parseString(subjectsXML, (err, result) => {
  const subjects = []

  result.SubjectsAndCourses.subject.forEach((obj, i) => {
    const name = obj.name[0]
    let file = filesDir + '/subject/' + latinize(name) + '.xml'
    while (file.indexOf('–') > -1) {
      file = file.replace('–', '-')
    }

    if (!i) {
      parseString(fs.readFileSync(file).toString(), (err, result) => {
        console.log(result.subject.gradeScale)
      })
    }
    // console.log(obj.name[0])
    // console.log(file)
    // console.log(fs.existsSync(file))
    // console.log('')
  })
})