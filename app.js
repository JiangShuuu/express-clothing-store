const express = require('express')
// const methodOverride = require('method-override')
const app = express()
const PORT = 3000
const routes = require('./routes')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/', (req, res) => {
  res.send('hello world')
})

app.use(routes)

app.listen(PORT, () => [
  console.log(`App is running in http://localhost:${PORT}`)
])

