const mongoose = require('mongoose')

const path = require ('path')

const coverimageBasePath = 'uploads/bookCovers'

const bookSchema = new mongoose.Schema({
 title: {
    type:String,
    required:true,
    validate: /\S+/
 },
 description: {
    type:String, 
    required: true,
 },
 publishDate: {
    type: Date,
    required:true,  
 },
 pageCount: {
    type: Number,
    required:true, 
 },
 createdAt: {
    type: Date,
    required:true,
    default:Date.now,
    validate: /\s+/
 },
 coverImagename:{
    type:String,
    required:true,
    
 },
 author:{
    type: mongoose.Schema.Types.String,
    required:true,
    ref:'Author'
 }
})

bookSchema.virtual('coverImagePath').get(function(){
   if (this.coverImagename != null){
      return path.join('/', coverimageBasePath, this.coverImagename)
   }
})

module.exports = mongoose.model('book', bookSchema)
module.exports.coverimageBasePath = coverimageBasePath