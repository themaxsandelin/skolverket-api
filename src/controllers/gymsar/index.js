// Route manager for /gymsar
// Data folder: gys

// Dependencies
const router = require('express').Router()

// Sub routes
router.use('/programmes', require('./programmes'))
router.use('/subjects', require('./subjects'))
router.use('/courses', require('./courses'))

router.get('/', (req, res) => {
  res.json({
    level: 'Gymnasiesärskolan och särvux gymnasial',
    routes: ['/programmes', '/programmes/[code]', '/subjects', '/subjects/[code]', '/courses', '/courses/[code]']
  })
})

module.exports = router
