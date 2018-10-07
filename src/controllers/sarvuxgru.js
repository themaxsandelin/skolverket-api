// Route manager for /sarvuxgr.
const router = require('express').Router()

router.get('/', (req, res) => {
  res.json({
    level: 'Särvux grundläggande',
    routes: [ ]
  })
})

module.exports = router
