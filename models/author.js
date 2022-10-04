const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
 name: {
    type:String,
    required:true,
    validate: /\S+/
 }
})
authorSchema.pre('remove', async function(next){
   console.log(this.id);
   let books=await Book.find({author:this.id})
      console.log(books);
      if (err){
         next(err)
      } else if (books.length>0){
         next(new Error('The Author still have books'))
      } else {
         next()
      }
   
})

module.exports = mongoose.model('Author', authorSchema)