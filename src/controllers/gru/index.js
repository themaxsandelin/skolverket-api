// Route manager for /gru.
const router = require('express').Router()

router.get('/', (req, res) => {
  res.json({
    level: 'Obligatoriska skolan',
    routes: [ ]
  })
})

module.exports = router
