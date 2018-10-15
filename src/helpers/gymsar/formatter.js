// Dependencies
const Turndown = require('turndown')

function Formatter() {
  const turndownService = new Turndown()

  function formatProgramme(data) {
    const programme = {
      name: data.name[0],
      code: data.code[0],
      skolfs: data.skolfsId[0],
      applianceDate: data.applianceDate[0],
      typeOfSchooling: data.typeOfSchooling[0],
      typeOfProgram: data.typeOfProgram[0],
      purpose: {},
      generalSubjects: [],
      programmeSubjects: [],
      specializationSubjects: [],
      orientations: [],
      profiles: [],
      individualChoice: [],
      projectAssignments: [],
      professionalDegrees: []
    }

    if (data.purpose[0].degreeObjective && data.purpose[0].degreeObjective[0] !== '') {
      programme.purpose.degreeObjective = {
        title: (typeof data.purpose[0].degreeObjective[0].title[0] === 'string') ? data.purpose[0].degreeObjective[0].title[0] : '',
        content: turndownService.turndown(data.purpose[0].degreeObjective[0].content[0])
      }
    }

    if (data.purpose[0].orientation && data.purpose[0].orientation[0] !== '') {
      programme.purpose.orientation = {
        title: (typeof data.purpose[0].orientation[0].title[0] === 'string') ? data.purpose[0].orientation[0].title[0] : '',
        content: turndownService.turndown(data.purpose[0].orientation[0].content[0])
      }
    }

    if (data.purpose[0].educationObjective && data.purpose[0].educationObjective[0] !== '') {
      programme.purpose.educationObjective = {
        title: (typeof data.purpose[0].educationObjective[0].title[0] === 'string') ? data.purpose[0].educationObjective[0].title[0] : '',
        content: turndownService.turndown(data.purpose[0].educationObjective[0].content[0])
      }
    }

    // Go through "commonMandatory" to get all general subjects.
    if (data.commonMandatory && data.commonMandatory[0] !== '') {
      programme.generalSubjects = formatSubjects(data.commonMandatory[0].subject)
    }

    // Go through "commonProgram" to get all programme specific subjects.
    if (data.commonProgram && data.commonProgram[0] !== '') {
      programme.programmeSubjects = formatSubjects(data.commonProgram[0].subject)
    }

    // Go through all "programOrientations" to get programme orientations.
    if (data.programOrientations && data.programOrientations[0] !== '') {
      data.programOrientations[0].programOrientation.forEach(orientationData => {
        const orientation = {
          name: orientationData.name[0],
          code: orientationData.code[0],
          points: parseInt(orientationData.point[0]),
          subjects: (orientationData.subject[0] !== '') ? formatSubjects(orientationData.subject) : []
        }
        programme.orientations.push(orientation)
      })
    }

    if (data.specialization && data.specialization[0] !== '') {
      programme.specializationSubjects = formatSubjects(data.specialization[0].subject)
    }

    // Go through "professionalDegrees"
    if (data.professionalDegrees && data.professionalDegrees[0] !== '') {
      data.professionalDegrees[0].professionalDegree.forEach(degreeData => {
        const degree = {
          name: degreeData.name[0],
          code: degreeData.programOrientationCode[0],
          subjects: (degreeData.subject && degreeData.subject[0] !== '') ? formatSubjects(degreeData.subject) : []
        }

        programme.professionalDegrees.push(degree)
      })
    }

    // Go through "projectAssignments"
    if (data.projectAssignment && data.projectAssignment[0] !== '') {
      data.projectAssignment[0].subject.forEach(subjectData => {
        programme.projectAssignments.push({
          name: subjectData.name[0],
          code: subjectData.code[0],
          optional: subjectData.optional[0] === 'true' ? true : false,
          alias: subjectData.alias[0] === 'true' ? true : false
        })
      })
    }

    // Go through "profiles"
    if (data.profiles && data.profiles[0] !== '') {
      programme.profiles = formatProfiles(data.profiles[0].profile)
    }

    return programme
  }

  function formatProfiles(profileList) {
    const profiles = []
    profileList.forEach(profileData => {
      const profile = {
        name: profileData.name[0],
        code: profileData.code[0],
        points: parseInt(profileData.points[0])
      }
      if (profileData.subject) {
        profile.subjects = formatSubjects(profileData.subject)
      }
      if (profileData.profileExits) {
        profile.exits = formatProfileExits(profileData.profileExits[0].profileExit)
      }

      profiles.push(profile)
    })

    return profiles
  }

  function formatProfileExits(exitList) {
    const exits = []

    exitList.forEach(exitData => {
      const exit = {
        name: exitData.name[0],
        points: parseInt(exitData.points[0])
      }
      if (exitData.subject) {
        exit.subjects = formatSubjects(exitData.subject)
      }
      if (exitData.optionalCourses) {
        exit.optionalCourses = formatSubjects(exitData.optionalCourses[0].subject)
      }

      exits.push(exit)
    })

    return exits
  }

  function formatSubjects(subjectList) {
    const subjects = []

    subjectList.forEach(subjectData => {
      const subject = {
        name: subjectData.name[0],
        code: subjectData.code[0]
      }
      if (subjectData.point) {
        subject.points = parseInt(subjectData.point[0])
      }
      if (subjectData.optional) {
        subject.optional = (subjectData.optional[0] === 'true')
      }
      if (subjectData.courses || subjectData.course) {
        subject.courses = formatCourses(subjectData.courses ? subjectData.courses : subjectData.course)
      }

      subjects.push(subject)
    })

    return subjects
  }

  function formatSubjectData(data) {
    const subject = {
      name: data.name[0],
      code: data.code[0],
      skolfs: data.skolfsId[0],
      applianceDate: data.applianceDate[0],
      typeOfSchooling: data.typeOfSchooling[0],
      category: data.category[0],
      description: turndownService.turndown(data.description[0]),
      purpose: turndownService.turndown(data.purpose[0])
    }
    if (data.courses) subject.courses = formatCourses(data.courses)
    if (data.centralContents) subject.centralContent = formatCentralContent(data.centralContents)
    if (data.knowledgeRequirements) subject.knowledgeRequirements = formatKnowledgeRequirements(data.knowledgeRequirements)

    return subject
  }

  function formatCourses(courseList) {
    const courses = []
    courseList.forEach(courseData => {
      courses.push(formatCourseData(courseData))
    })
    return courses
  }

  function formatCourseData(courseData) {
    const course = {
      name: courseData.name[0],
      code: courseData.code[0]
    }
    if (courseData.point) course.points = parseInt(courseData.point[0])
    if (courseData.description) course.description = turndownService.turndown(courseData.description[0])
    if (courseData.centralContent) course.centralContent = turndownService.turndown(courseData.centralContent[0])
    if (courseData.knowledgeRequirements) course.knowledgeRequirements = formatKnowledgeRequirements(courseData.knowledgeRequirements)

    return course
  }

  function formatCentralContent(blocks) {
    const content = []
    blocks.forEach(block => {
      const row = {
        text: turndownService.turndown(block.text[0])
      }
      if (block.year && typeof block.year[0] === 'string') row.year = block.year[0]

      content.push(row)
    })

    return content.length > 1 ? content : content[0]
  }

  function formatKnowledgeRequirements(requirementsList) {
    const requirements = []
    requirementsList.forEach(reqData => {
      const req = { description: turndownService.turndown(reqData.text[0]) }

      if (reqData.gradeStep) req.grade = reqData.gradeStep[0]
      if (reqData.year && typeof reqData.year[0] === 'string') req.year = reqData.year[0]

      requirements.push(req)
    })

    return requirements
  }

  return {
    formatProgramme,
    formatSubjects,
    formatSubjectData,
    formatCourseData
  }
}

module.exports = Formatter()
