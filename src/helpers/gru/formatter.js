// Dependencies
const Turndown = require('turndown')

function Formatter() {
  const turndownService = new Turndown()

  function formatCurriculum(data) {
    const curriculum = {
      name: data.name[0],
      code: data.code[0],
      skolfs: data.skolfsId[0],
      version: parseInt(data.version[0]),
      status: data.status[0],
      applianceDate: data.applianceDate[0],
      heading: turndownService.turndown(data.heading[0]),
      sections: formatCurriculumSections(data.section),
      createdBy: data.createdBy[0],
      createdOn: data.createdDate[0],
      modifiedBy: data.modifiedBy[0],
      modifiedOn: data.modifiedDate[0]
    }

    return curriculum
  }

  function formatCurriculumSections(sectionList) {
    const sections = []
    sectionList.forEach(section => {
      sections.push({
        type: section.type[0],
        heading: turndownService.turndown(section.heading[0]),
        content: turndownService.turndown(section.content[0])
      })
    })
    return sections
  }

  function formatSubject(data) {
    const subject = {
      name: data.name[0],
      code: data.code[0],
      designation: data.designation[0],
      skolfs: data.skolfsId[0],
      version: parseInt(data.version[0]),
      status: data.status[0],
      applianceDate: data.applianceDate[0],
      typeOfSyllabus: data.typeOfSyllabus[0],
      originatorTypeOfSchooling: data.originatorTypeOfSchooling[0],
      purposeHeading: turndownService.turndown(data.purposeHeading[0]),
      purpose: turndownService.turndown(data.purpose[0]),
      centralContentHeading: turndownService.turndown(data.centralCntHeading[0]),
      centralContent: formatCentralContent(data.centralContent),
      knowledgeRequirementsHeading: turndownService.turndown(data.knowledgeReqsHeading[0]),
      knowledgeRequirements: formatKnowledgeRequirements(data.knowledgeRequirement),
      createdBy: data.createdBy[0],
      createdOn: data.createdDate[0],
      modifiedBy: data.modifiedBy[0],
      modifiedOn: data.modifiedDate[0]
    }

    return subject
  }

  function formatCentralContent(blocks) {
    const content = []
    blocks.forEach(block => {
      content.push({
        year: block.year[0],
        text: turndownService.turndown(block.text[0])
      })
    })
    return content
  }

  function formatKnowledgeRequirements(requirementsList) {
    const requirements = []
    requirementsList.forEach(reqData => {
      requirements.push({
        grade: reqData.gradeStep ? reqData.gradeStep[0] : '',
        year: reqData.year ? reqData.year[0] : '',
        description: turndownService.turndown(reqData.text[0])
      })
    })

    requirements.sort((a, b) => {
      return a.year - b.year || a.grade - b.grade
    })

    return requirements
  }

  return {
    formatCurriculum,
    formatSubject
  }
}

module.exports = Formatter()
