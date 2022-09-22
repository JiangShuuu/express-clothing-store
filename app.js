if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const methodOverride = require('method-override')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 8888
const routes = require('./routes')
const session = require('express-session')
const SESSION_SECRET = 'secret'
const path = require('path')

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(methodOverride('_method'))

app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use(routes)

app.listen(PORT, () => [
  console.log(`App is running in http://localhost:${PORT}`)
])

