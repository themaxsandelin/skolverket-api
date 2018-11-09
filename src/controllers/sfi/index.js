// Route manager for /sfi.
// Data folder: sfi
const router = require('express').Router()

// Sub routes
router.use('/subjects', require('./subjects'))
router.use('/courses', require('./courses'))

router.get('/', (req, res) => {
  res.json({
    level: 'Komvux sfi',
    routes: [ '/subjects', '/subjects/[code]', '/courses', '/courses/[code]' ]
  })
})

module.exports = router
