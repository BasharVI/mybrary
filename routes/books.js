const { Router } = require('express')
const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require ('fs')
const router = express.Router()
const Book = require ('../models/book')
const uploadPath = path.join('public',Book.coverimageBasePath)
const Author = require ('../models/author')
const { error } = require('console')
const imageMimeType = ['image/jpeg','image/gif','image/png']
const upload = multer({
    dest:uploadPath,
    fileFilter:(req,file,callback)=>{
        callback(null , imageMimeType.includes(file.mimetype))
    }

})



//All Books Route
router.get('/', async(req,res)=>{
    let query = Book.find()
    if(req.query.title != null && req.query.title != ''){
        query= query.regex('title',new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishBefore != null && req.query.publishBefore != ''){
        query= query.lte('publishDate', req.query.publishBefore)
    }
    if(req.query.publishAfter != null && req.query.publishAfter != ''){
        query= query.gte('publishDate', req.query.publishAfter)
    }
    
    try {
        const books = await query.exec()
        res.render('books/index',{
            books:books,
            searchOption:req.query
        })

    }catch{
        res.render('/')
    }
    

})

// New Book Route
router.get('/new', async (req,res)=>{
    renderNewPage(res,new Book())

})
 
//Create Book Route
router.post('/', upload.single('cover') , async(req,res)=>{

    const fileName = req.file != null ? req.file.filename:null
    const book =new Book({
        title:req.body.title,
        author:req.body.author,
        publishDate:new Date(req.body.publishDate),
        pageCount:req.body.pageCount,
        coverImagename:fileName,
        description:req.body.description
        
    })
    try {
        const newBook=await book.save()
        //res.redirect('books/$(newBook.id')
        res.redirect('books')

    }catch (err){  
        console.log(err);
        if (book.coverImagename != null){
            removeCovrerImage(book.coverImagename)
        }   
        renderNewPage(res, book, true)
        
    }

   
})

function removeCovrerImage(fileName){
    fs.unlink(path.join(uploadPath,fileName), err=>{
        console.error(err)
    })
}

async function renderNewPage(res, book, hasError=false){
    try{
        const authors =await Author.find({})
        const params = {
            authors:authors,
            book:book 
        }
        if (hasError) params.errorMessage = "Error creating Book"
        res.render('books/new', params)

    }catch{
        
        res.redirect('/books')
    }

}

module.exports= router