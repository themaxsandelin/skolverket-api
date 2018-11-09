// Route manager for /vuxgru.
// Data folder: /vuxgr

const router = require('express').Router()

// Sub routes
router.use('/subjects', require('./subjects'))

router.get('/', (req, res) => {
  res.json({
    level: 'Kommunal vuxenutbildning grundläggande',
    routes: [ '/subjects', '/subjects/[code]', ]
  })
})

module.exports = router
