const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

//All authors router
router.get('/', async (req,res)=>{
    let searchOptions = {}
    //get request is sent through query string ...?name=jo
    if(req.query.name !== null && req.query.name !== ''){ //if there's a query sent to the server
        searchOptions.name = new RegExp(req.query.name, 'i') //case insensitive
    } 
    try{
        const authors = await Author.find(searchOptions) //find objects with no searchOptions
        res.render('authors/index', 
            {authors: authors, //passing var on the line before 
            searchOptions:req.query}) //send back the query to user
    }catch{
        res.redirect('/')

    }
})

//new authors router
router.get('/new',(req,res)=>{
    res.render('authors/new',{ author: new Author()});
})

//create author route
router.post('/', async (req,res)=>{
    const author = new Author({
        name: req.body.name //post request is sent through body
    })
    try{
        const newAuthor = await author.save()//wait for this to complete
        res.redirect(`authors/${newAuthor.id}`)
        // res.redirect('authors')
    }catch{
        res.render('authors/new',{
            author: author,
            errorMessage: "Error creating Author"
        })
    }
    // author.save()
    // .then((newAuthor)=>{
    //     res.redirect("authors/${newAuthor.id}")
    //     res.redirect('authors')
    // })
    // .catch((err)=>{
    //     res.render('authors/new',{
    //         author: author,
    //         errorMessage: "Error creating Author"
    //     })
    // })
})

//for showing the user
router.get('/:id', async(req,res)=>{
    try{
        const author = await Author.findById(req.params.id)
        const books = await Book.find({author: author.id}).limit(6).exec()
        res.render('authors/show',{
            author : author,
            booksByAuthor : books
        })
    }catch(error){
        console.log(error)
        res.redirect('/')
    }
})

//edit author
router.get('/:id/edit', async (req,res)=>{
    try{
        const author = await Author.findById(req.params.id)
        res.render('authors/edit',{ author: author});
    }catch{
        res.redirect('/authors')
    }

})

//update author
router.put('/:id', async (req,res)=>{
    let author
    try{
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    }catch{
        if(author == null){
            res.redirect('/')
        }else{
         res.render('authors/edit',{
            author: author,
            errorMessage: "Error updating Author"
        })           
        }
    }
})

router.delete('/:id', async (req,res)=>{
    let author
    try{
        author = await Author.findById(req.params.id)
        await author.deleteOne()
        res.redirect(`/authors`)
    }catch(error){
        if(author == null){
            console.log('author not found')
            res.redirect('/')
        }else{
            console.log(error)
            res.redirect(`/authors/${author.id}`)       
        }
    }
})

module.exports = router;