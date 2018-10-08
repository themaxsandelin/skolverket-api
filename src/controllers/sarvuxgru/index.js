// Route manager for /sarvuxgru.
const router = require('express').Router()

router.get('/', (req, res) => {
  res.json({
    level: 'Särvux grundläggande',
    routes: [ ]
  })
})

module.exports = router
