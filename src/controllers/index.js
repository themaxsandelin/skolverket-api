// Main route manager.
const router = require('express').Router()

/**
 * Routes:
 *
 * - compulsory => 'Obligatoriska skolan'
 * - syllabus => 'Gymnasieskolan och komvux gymnasial'
 * - gys => 'Gymnasiesärskolan och särvux gymnasial'
 * - vuxgr => 'Kommunal vuxenutbildning grundläggande'
 * - sarvuxgr => 'Särvux grundläggande'
 * - sfi => 'Komvux sfi'
 */

router.get('/', (req, res) => {
  res.send('This API is not officially owned, facilitated or affiliated with Skolverket. It is built as an open API alternative to Skolverket\'s open data solution.')
})

module.exports = router
