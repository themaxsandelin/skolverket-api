const express = require('express')

const app = express()

// Include the controller files for managing routes.
app.use('/', require('./controllers'))

app.listen(3000, () => {
  console.log('API up and running.')
})
