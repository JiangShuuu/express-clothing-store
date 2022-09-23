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
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json')

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(methodOverride('_method'))

app.use('/upload', express.static(path.join(__dirname, 'upload')))

// const options = {
//   swaggerDefinition: {
//     // 這邊會是你的api文件網頁描述
//     info: {
//       title: 'ec_web_demo API',
//       version: '1.0.0',
//       description: 'Generate ec_web_demo API document with swagger'
//     }
//   },
//   // 這邊會是你想要產生的api文件檔案，我是直接讓swagger去列出所有controllers
//   apis: ['./controllers/*.js']
// };
// const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(routes)

app.listen(PORT, () => [
  console.log(`App is running in http://localhost:${PORT}`)
])

