// Main route manager.
const router = require('express').Router()

router.use('/gru', require('./gru'))
router.use('/gym', require('./gym'))
router.use('/gymsar', require('./gymsar'))
router.use('/vuxgru', require('./vuxgru'))
router.use('/sarvuxgru', require('./sarvuxgru'))
router.use('/sfi', require('./sfi'))

router.get('/', (req, res) => {
  res.send(
    '<p>' +
      '<b>This API is not officially owned, facilitated or affiliated with Skolverket.</b><br><br>' +
      'It is built as an open API alternative to Skolverket\'s open data solution, to make it easier to build tools and apps using this data.<br>' +
      'The API uses the data served in the archive files from <a href="http://opendata.skolverket.se">opendata.skolverket.se</a> and keeps the data up to date every 24 hours.<br>' +
      'I published the solution under this domain to make it as clear as possible as to where this data originates from and who supplies it, but also to get the attention of Skolverket in the hopes of making this an official solution.<br><br><br>' +

      '<b>Available routes:</b><br><br>' +

      'Obligatoriska skolan<br>' +
      '<a href="/gru">/gru</a><br><br>' +

      'Gymnasieskolan och komvux gymnasial<br>' +
      '<a href="/gym">/gym</a><br><br>' +

      'Gymnasiesärskolan och särvux gymnasial<br>' +
      '<a href="/gymsar">/gymsar</a><br><br>' +

      'Kommunal vuxenutbildning grundläggande<br>' +
      '<a href="/vuxgru">/vuxgru</a><br><br><br>' +

      '<b>Work-in-progress routes:</b><br><br>' +

      'Särvux grundläggande (WIP)<br>' +
      '<a href="/sarvuxgru">/sarvuxgru</a><br><br>' +

      'Komvux sfi (WIP)<br>' +
      '<a href="/sfi">/sfi</a><br><br><br>' +

      '<b>Built and facilitated by <a href="https://github.com/themaxsandelin" target="_blank">Max Sandelin</a></b><br><br>' +
      'This API is completely open source, and you can find the <a href="https://github.com/themaxsandelin/skolverket-api" target="_blank">repository here.</a>' +
    '</p>'
  )
})

module.exports = router
