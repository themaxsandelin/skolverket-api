// Route manager for /sfi.
const router = require('express').Router()

router.get('/', (req, res) => {
  res.json({
    level: 'Komvux sfi',
    routes: [ ]
  })
})

module.exports = router
