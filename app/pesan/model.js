const mongoose = require('mongoose')

let pesanSchema = mongoose.Schema({
  text : {
    type : String,
  },
  link : {
    type : String,
  },
}, { timestamps: true })

module.exports = mongoose.model('Pesan', pesanSchema)