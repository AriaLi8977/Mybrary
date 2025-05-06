const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const imageMimeTypes = ['image/jpeg','image/png','image/gif']
const Author = require('../models/author')

//All books router
router.get('/', async (req,res)=>{
    let query = Book.find()
    if(req.query.title!=null && req.query.title!= ''){
        query = query.regex('title',new RegExp(req.query.title,'i'))
    }
    if(req.query.publishedBefore!=null && req.query.publishedBefore!= ''){
        query = query.lte('publishedDate',req.query.publishedBefore)
    }
    if(req.query.publishedAfter!=null && req.query.publishedAfter!= ''){
        query = query.gte('publishedDate',req.query.publishedAfter)
    }
    try{
        const books = await query.exec()
        res.render('books/index',{
            books:books,
            searchOptions: req.query
        })
    }catch{
        res.redirect('/')
    }
})

//new books router
router.get('/new', async (req,res)=>{
    renderNewPage(res, new Book())
})

//create book route
router.post('/', async (req,res)=>{
    const fileName = req.file!= null ? req.file.filename: null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate), //var in req is a string, we need to convert that
        pageCount: req.body.pageCount,
        // coverImageName : fileName,
        description:req.body.description
    })
    saveCover(book, req.body.cover)
    console.log('cover saved')
    try{
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)
    }catch(error){
        console.log(error)
        // if(book.coverImageName!=null){
        //     removeBookCover(book.coverImageName) 
        // }
        renderNewPage(res, book, true)
    }
})

router.get('/:id', async (req, res) =>{
    try{
        const book = await Book.findById(req.params.id)
                            .populate('author')
                            .exec()
        res.render('books/show',{book: book})
    } catch(error) {
        console.log(error)
        res.redirect('/')
    }
})

//edit books router
router.get('/:id/edit', async (req,res)=>{
    try{
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)
    } catch{
        res.redirect('/')
    }
})

//update book route
router.put('/:id', async (req,res)=>{
    let book
    try{
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if( req.body.cover != null && req.body.cover != ''){
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    }catch{
        if( book != null){
            renderEditPage(res, book, true)
        }else{
            res.redirect('/')
        }
        
    }
})

//Delete book page
router.delete('/:id', async (req, res)=>{
    let book
    try{
        book = await Book.findById(req.params.id)
        await book.deleteOne()
        res.redirect('/books')
    }catch{
        if(book != null){
            res.render('books/show', {book : book, errorMessage: 'Cannot remove book'})
        }else{
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, book, hasError = false){
    renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false){
    renderFormPage(res, book, 'edit', hasError)
}


async function renderFormPage(res, book, form, hasError = false){
    try{
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if(hasError && form === 'edit') params.errorMessage = 'Error Updating Book'
        if(hasError) params.errorMessage = 'Error Creating Book'
        res.render(`books/${form}`, params)
    }catch(error){
        console.log(error)
        res.redirect('/books')
    }
}

// function removeBookCover(fileName){
//     fs.unlink(path.join(uploadPath,fileName),err=>{ //unlink is for deleting file
//         if(err) console.error(err)
//     })
// }

function saveCover(book, coverEncoded){
    if(coverEncoded === null) return
    const cover = JSON.parse(coverEncoded) //decode the cover
    if(cover != null && imageMimeTypes.includes(cover.type)){
        //if cover is valid, put it in a buffer, and note the type
        //so that later we can covert it to the correct type
        book.coverImage = new Buffer.from(cover.data,'base64')
        book.coverImageType = cover.type
    }
}

module.exports = router;