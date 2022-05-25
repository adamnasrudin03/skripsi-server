const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
  email: {
    type: String,
    require: [true, 'email harus diisi']
  },
  name: {
    type: String,
    require: [true, 'nama harus diisi']
  },
  password: {
    type: String,
    require: [true, 'kata sandi harus diisi']
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin', 'guest'],
    default: 'guest'
  },
  status: {
    type: String,
    enum: ['Y', 'N'],
    default: 'Y'
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'male'
  },
  phoneNumber: {
    type: String,
    require: [true, 'nomor telpon harus diisi']
  },
  avatar : {type : String},

}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
