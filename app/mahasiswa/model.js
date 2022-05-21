const mongoose = require('mongoose')

let mahasiswaSchema = mongoose.Schema({
  npm: {
    type: String,
    require: [true, 'Nomor Pokok Mahasiswa harus diisi']
  },
  nama: {
    type: String,
    require: [true, 'Nama mahasiswa harus diiisi'],
    maxlength :[225, "panjang nama harus antara 3 - 225 karakter"],
    minlength :[3, "panjang nama harus antara 3 - 225 karakter"]
  },
  email: {
    type: String,
    require: [true, 'Email mahasiswa harus diiisi']
  },
  lanjutan: {
    type: Boolean,
    default: false
  },
  semester: {
    type: String,
    require: [true, 'Semester mahasiswa saat ini harus diiisi']
  },
  no_wa: {
    type: String,
    require: [true, 'No Whatsapp mahasiswa harus diiisi'],
    maxlength :[13, "panjang nomor whatsapp harus antara 9 - 13 karakter"],
    minlength :[9, "panjang nomor whatsapp harus antara 9 - 13 karakter"]
  },
  judul_skripsi: {
    type: String,
    require: [true, 'Judul skripsi yang akan dibuat mahasiswa harus diiisi'],
    maxlength :[225, "panjang judul skripsi harus antara 3 - 225 karakter"],
    minlength :[3, "panjang judul skripsi harus antara 3 - 225 karakter"]
  },
  tema_skripsi: {
    type: String,
    enum: ['bidang_aplikasi_desktop', 'bidang_aplikasi_web', 'bidang_aplikasi_mobile', 
      'bidang_data_mining', 'bidang_iot', 'bidang_desain_aplikasi', 
      'bidang_jaringan_komputer', 'bidang_basis_data'],
    require: [true, 'Tema skripsi yang akan dibuat mahasiswa harus diiisi']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
    require: [true, 'Status pengajuan proposal skripsi harus diiisi']
  },
  file_proposal : {type : String},
  file_rekap_nilai : {type : String},
  mata_kuliah_lain : {type : String, default: '-'},
  dosen_sebelum : {type : String, default: '-'},
  dosen_sebelum2 : {type : String, default: '-'},
  ajaran : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ajaran',
    require: [true, 'Tahun Ajaran skripsi harus diiisi']
  },
  dosen : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dosen'
  },
  dosen2 : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dosen'
  },
  pesan : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pesan'
  }
}, { timestamps: true })

module.exports = mongoose.model('Mahasiswa', mahasiswaSchema)