// Route manager for /gymsar
// Data folder: gys

// Dependencies
const router = require('express').Router()

// Sub routes
router.use('/programmes', require('./programmes'))

router.get('/', (req, res) => {
  res.json({
    level: 'Gymnasiesärskolan och särvux gymnasial',
    routes: ['/programmes', '/programmes/[code]']
  })
})

module.exports = router
