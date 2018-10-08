// Route manager for: /gym/courses
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

router.get('/:code', (req, res) => {
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
