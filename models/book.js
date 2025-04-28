const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'

//schema is a table for sql db
const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type:String
    },
    publishDate:{
        type:Date,
        required:true
    },
    pageCount:{
        type:Number,
        required:true
    },
    createAt:{
        type:Date,
        required: true,
        default: Date.now
    },
    coverImageName:{
        type: String,
        required: true
    },
    author:{ //refer to the author schema
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'Author'
    }
})


//virtual path derive val from the schema above，this calculated val won't be saved in mongo db
bookSchema.virtual('coverImagePath').get(function(){ //we use normal func so that we can use this.
    if(this.coverImageName != null){
        return path.join('/',coverImageBasePath,this.coverImageName)
    }
})


module.exports = mongoose.model('Book',bookSchema)
module.exports.coverImageBasePath = coverImageBasePath