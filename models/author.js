const mongoose = require('mongoose')
const Book = require('./book')

//schema is a table for sql db
const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

authorSchema.pre('deleteOne',{document:true, query:false}, async function(next){
    try{
        const books = await Book.find({author: this.id}).exec()
        console.log(books);
        if(books.length > 0){
            next(new Error('This author has books still'))
        }else{
            next()
        }
    }catch(error){
        console.log(error)
        next(error)
    }
})

// authorSchema.pre('deleteOne', function(next){
//     Book.find({ author : this.id }, (err, books)=>{
//         if(err){
//             next(err)
//         }else if(books.length > 0){
//             next(new Error('This author has books still'))
//         }else{
//             next()
//         }            

//     })
// })

module.exports = mongoose.model('Author',authorSchema)