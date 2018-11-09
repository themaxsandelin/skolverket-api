// Route manager for /sarvuxgru.
const router = require('express').Router()

// Sub routes
router.use('/subjects', require('./subjects'))
router.use('/subject-areas', require('./subjectAreas'))

router.get('/', (req, res) => {
  res.json({
    level: 'Särvux grundläggande',
    routes: [ '/subjects', '/subjects/[code]', '/subject-areas', '/subject-areas/[code]' ]
  })
})

module.exports = router
