// Route manager for /gymsar.
const router = require('express').Router()

router.get('/', (req, res) => {
  res.json({
    level: 'Gymnasiesärskolan och särvux gymnasial',
    routes: [ ]
  })
})

module.exports = router
