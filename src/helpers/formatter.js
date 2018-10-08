// Dependencies
const Turndown = require('turndown')

function Formatter() {
  const turndownService = new Turndown()

  function formatProfiles(profileList) {
    const profiles = []
    profileList.forEach(profileData => {
      profiles.push({
        name: profileData.name[0],
        code: profileData.code[0],
        points: parseInt(profileData.points[0]),
        subjects: formatSubjects(profileData.subject)
      })
    })

    return profiles
  }

  function formatSubjects(subjectList) {
    const subjects = []

    subjectList.forEach(subjectData => {
      const subject = {
        name: subjectData.name[0],
        code: subjectData.code[0]
      }
      if (subjectData.courses) subject.courses = formatCourses(subjectData.courses)
      if (subjectData.course) subject.courses = formatCourses(subjectData.course)
      if (subjectData.point) subject.points = parseInt(subjectData.point[0])

      subjects.push(subject)
    })

    return subjects
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

  function formatKnowledgeRequirements(requirementsList) {
    const requirements = []
    requirementsList.forEach(reqData => {
      requirements.push({
        grade: reqData.gradeStep[0],
        description: turndownService.turndown(reqData.text[0])
      })
    })

    return requirements
  }


  return {
    formatProfiles,
    formatCourses,
    formatCourseData,
    formatSubjects
  }
}

module.exports = Formatter()
