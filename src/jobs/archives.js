// Dependencies
const http = require('http')
const tar = require('tar')
const async = require('async')
const fs = require('fs')
const rimraf = require('rimraf')
const schedule = require('node-schedule')

const archives = [ 'compulsory', 'syllabus', 'gys', 'vuxgr', 'sarvuxgr', 'sfi' ]
const archiveBaseUrl = 'http://opendata.skolverket.se/data/'
const filesDir = __dirname + '/../../files'
const args = process.argv.slice(2, process.argv.length)

function downloadArchives() {
  console.log('Archive process started at ' + new Date())

  // Ensure the files directory exists.
  if (!fs.existsSync(filesDir)) fs.mkdirSync(filesDir)

  // Iterate through all archives and download them.
  async.eachSeries(archives, (name, callback) => {
    // Delete the existing target directory (if it exists).
    if (fs.existsSync(filesDir + '/' + name)) rimraf.sync(filesDir + '/' + name)
    // Ensure the target directory exists.
    fs.mkdirSync(filesDir + '/' + name)
    // Download the archive and pipe in the extractor.
    const req = http.get(archiveBaseUrl + name + '.tgz', response => {
      response.pipe(tar.x({
        strip: 1,
        C: filesDir + '/' + name
      })).on('finish', _ => {
        // Listen for the process being done, and continue the iterator.
        console.log(' - Finished downloading ' + name + ' at ' + new Date())
        callback()
      }).on('error', err => callback(err))
    })
  }, (error) => {
    if (error) return console.log(error)

    // All done!
    console.log('Archive process finished at ' + new Date())
  })
}

// Run the process first on execution.
downloadArchives()

// Set up process to run every day at 2am.
if (args.indexOf('--no-job') === -1) {
  const p = schedule.scheduleJob('0 2 * * *', downloadArchives)
}
