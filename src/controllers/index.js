// Main route manager.
const router = require('express').Router()

/**
 * Routes:
 *
 * - compulsory / gru => 'Obligatoriska skolan'
 * - syllabus / gym => 'Gymnasieskolan och komvux gymnasial'
 * - gys / gymsar => 'Gymnasiesärskolan och särvux gymnasial'
 * - vuxgr / vuxgru => 'Kommunal vuxenutbildning grundläggande'
 * - sarvuxgr / sarvuxgru => 'Särvux grundläggande'
 * - sfi => 'Komvux sfi'
 */

router.use('/gru', require('./gru'))
router.use('/gym', require('./gym'))
router.use('/gymsar', require('./gymsar'))
router.use('/vuxgru', require('./vuxgru'))
router.use('/sarvuxgru', require('./sarvuxgru'))
router.use('/sfi', require('./sfi'))

router.get('/', (req, res) => {
  res.send(
    '<p>' +
      'This API is not officially owned, facilitated or affiliated with Skolverket.<br>' +
      'It is built as an open API alternative to Skolverket\'s open data solution.<br><br>' +

      'Available routes:<br><br>' +

      'Obligatoriska skolan<br>' +
      '<a href="/gru">/gru</a><br><br>' +

      'Gymnasieskolan och komvux gymnasial<br>' +
      '<a href="/gym">/gym</a><br><br>' +

      'Gymnasiesärskolan och särvux gymnasial<br>' +
      '<a href="/gymsar">/gymsar</a><br><br>' +

      'Kommunal vuxenutbildning grundläggande<br>' +
      '<a href="/vuxgru">/vuxgru</a><br><br>' +

      'Särvux grundläggande<br>' +
      '<a href="/sarvuxgru">/sarvuxgru</a><br><br>' +

      'Komvux sfi<br>' +
      '<a href="/sfi">/sfi</a><br><br>' +

      'Built and facilitated by <a href="https://github.com/themaxsandelin" target="_blank">Max Sandelin</a><br>' +
      '<a href="https://github.com/themaxsandelin/skolverket-api" target="_blank">Repository</a>' +
    '</p>'
  )
})

module.exports = router
