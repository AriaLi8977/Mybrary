if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')

app.set('view engine','ejs') //set our view engine
app.set('views',__dirname + '/views') //set where our view is coming from
app.set('layout', 'layouts/layout') //all the header and footer will be saved in layout to avoid duplication
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit:'50mb', extended:false}))
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true})
const db = mongoose.connection
db.on('error', error=> console.error(error))
db.once('open',()=> console.log('Connected to Mongoose'))

app.use('/',indexRouter)
app.use('/authors',authorRouter)
app.use('/books',bookRouter)

app.listen(process.env.PORT || 3000)
