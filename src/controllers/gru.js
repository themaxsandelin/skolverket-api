// Route manager for /compulsory.
const router = require('express').Router()

router.get('/', (req, res) => {
  res.json({
    level: 'Obligatoriska skolan',
    routes: [ ]
  })
})

module.exports = router
