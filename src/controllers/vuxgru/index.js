// Route manager for /vuxgru.
const router = require('express').Router()

router.get('/', (req, res) => {
  res.json({
    level: 'Kommunal vuxenutbildning grundläggande',
    routes: [ ]
  })
})

module.exports = router
