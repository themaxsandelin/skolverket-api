// Route manager for /gru.
// Data folder: compulsory

// Dependencies
const router = require('express').Router()

// Sub routes
router.use('/curriculums', require('./curriculums'))
router.use('/subjects', require('./subjects'))

router.get('/', (req, res) => {
  res.json({
    level: 'Obligatoriska skolan',
    routes: ['/curriculums', '/curriculums/[level]', '/subjects', '/subjects/[level]', '/subjects/[level]/[code]']
  })
})

module.exports = router
