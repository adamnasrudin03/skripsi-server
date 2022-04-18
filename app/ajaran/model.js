const mongoose = require('mongoose')

let ajaranSchema = mongoose.Schema({
  start_year: {
    type: String,
    require: [true, 'Tahun awal ajaran harus diiisi']
  },
  end_year: {
    type: String,
    require: [true, 'Tahun akhir ajaran harus diiisi']
  },
  semester: {
    type: String,
    require: [true, 'Semester Tahun ajaran harus diiisi']
  },
  start_at: {
    type: String,
    require: [true, 'Tanggal awal pengajuan harus diiisi']
  },
  end_at: {
    type: String,
    require: [true, 'Tanggal akhir pengajuan  harus diiisi']
  }
}, { timestamps: true })

module.exports = mongoose.model('Ajaran', ajaranSchema)