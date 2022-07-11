// Happy coding guys

const express = require('express')
// const bodyParser = require('bodyParser')
const app = express()
const port = 3000
const router = require('./routers/index')

app.set('view engine', 'ejs')
// app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}))
// app.use(express.json())

app.use('/', router)

app.listen(port, () => {

    console.log(`listen to the at http://localhost:${port}`)
})

