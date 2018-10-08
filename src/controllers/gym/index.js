// Route manager for: /gym
// Data folder: syllabus

// Dependencies
const router = require('express').Router()

// Sub routes
router.use('/programmes', require('./programmes'))
router.use('/orientations', require('./orientations'))
router.use('/subjects', require('./subjects'))
router.use('/courses', require('./courses'))

router.get('/', (req, res) => {
  res.json({
    level: 'Gymnasieskolan och komvux gymnasial',
    routes: [ '/programmes', '/programmes/[code]', '/orientations', '/orientations/[code]', '/subjects', '/subjects/[code]', '/courses', '/courses/[code]']
  })
})

module.exports = router
