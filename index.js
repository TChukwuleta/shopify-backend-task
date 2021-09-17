const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const app = express()
const appRoutes = require('./routes/userRoutes')
const dotenv = require('dotenv')
dotenv.config()

mongoose.connect(`${process.env.MONGO_URL}`, { useNewUrlParser: true })
.then(() => {
    console.log('Leggo')
})
.catch((e) => { 
    console.log(e)
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())

app.use(appRoutes)

app.set('view engine', 'ejs')

const port = process.env.PORT || 2021
app.listen(port, () => {
    console.log(`App is ready and listening on port ${port}`)
})