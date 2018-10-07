// Route manager for /gys.
const router = require('express').Router()

router.get('/', (req, res) => {
  res.json({
    level: 'Gymnasiesärskolan och särvux gymnasial',
    routes: [ ]
  })
})

module.exports = router
