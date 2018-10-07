// Route manager for: /gym
// Data folder: syllabus

const router = require('express').Router()
const { parseString } = require('xml2js')
const fs = require('fs')
const path = require('path')

const latinize = require('../helpers/latinize')

const rootPath = path.resolve(__dirname + '/../../files/syllabus')

router.get('/', (req, res) => {
  res.json({})
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
          const programme = {
            name: result.program.name[0],
            code: result.program.code[0]
          }
          console.log(result)

          res.json(result)
        })
      }
    })

    if (!validCode) res.status(404).send('Not found.')
  })
})

router.get('/subjects', (req, res) => {
  const file = rootPath + '/subjectsAndCourses/amnen_och_kurser.xml'

  parseString(fs.readFileSync(file).toString(), (err, result) => {
    const subjects = []

    result.SubjectsAndCourses.subject.forEach(subject => {
      const courses = []
      if (subject.courses) {
        subject.courses.forEach(course => {
          courses.push({
            name: course.name[0],
            code: course.code[0],
            point: course.point[0]
          })
        })
      }

      subjects.push({
        name: subject.name[0],
        code: subject.code[0],
        courses: courses
      })
    })

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
          res.json(result)
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
                  const knowledgeRequirements = []
                  courseData.knowledgeRequirements.forEach(knowReq => {
                    knowledgeRequirements.push({
                      grade: knowReq.gradeStep[0],
                      requirement: knowReq.text[0]
                    })
                  })

                  res.json({
                    name: courseData.name[0],
                    code: courseData.code[0],
                    points: courseData.point[0],
                    description: courseData.description[0],
                    centralContent: courseData.centralContent[0],
                    knowledgeRequirements: knowledgeRequirements
                  })
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
