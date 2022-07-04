if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const methodOverride = require('method-override')
const app = express()
const PORT = 3000
const routes = require('./routes')
//const passport = require('./config/passport')
const session = require('express-session')
const SESSION_SECRET = 'secret'

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(methodOverride('_method'))

//app.use(passport.initialize()) // 初始化 Passport
//app.use(passport.session()) // 啟動 session 功能

app.use(routes)

app.listen(PORT, () => [
  console.log(`App is running in http://localhost:${PORT}`)
])

