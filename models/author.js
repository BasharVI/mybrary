const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
 name: {
    type:String,
    required:true,
    validate: /\S+/
 }
})

module.exports = mongoose.model('Author', authorSchema)