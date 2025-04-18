const mongoose = require('mongoose')

//schema is a table for sql db
const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Author',authorSchema)