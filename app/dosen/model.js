const mongoose = require('mongoose');
const nilai = require('./nilai');
const SchemaTypes = mongoose.Schema.Types;

let dosenSchema = mongoose.Schema({
  nidn: {
    type: String,
    require: [true, 'NIDN dosen harus diiisi']
  },
  nama: {
    type: String,
    require: [true, 'Nama lengkap dosen harus diiisi']
  },
  gelar: {
    type: String,
    require: [true, 'Gelar dosen harus diiisi']
  },
  email: {
    type: String,
    require: [true, 'Email dosen harus diiisi']
  },
  no_wa: {
    type: String,
    require: [true, 'No whatsapp dosen harus diiisi'],
    maxlength :[13, "panjang nomor whatsapp harus antara 9 - 13 karakter"],
    minlength :[9, "panjang nomor whatsapp harus antara 9 - 13 karakter"]
  },
  status: {
    type: String,
    enum: ['Y', 'N'],
    default: 'Y',
    require: [true, 'Status dosen harus diiisi']
  },
  pendidikan: {
    type: SchemaTypes.Decimal128,
    enum: [nilai.pendidikan.s2, nilai.pendidikan.s3],
    default: nilai.pendidikan.s2,
    require: [true, 'Jenjang Pendidikan dosen harus diiisi']
  },
  fungsional: {
    type: SchemaTypes.Decimal128,
    enum: [nilai.fungsional.tenagaPengajar, nilai.fungsional.asistenAhli, 
      nilai.fungsional.lektor, nilai.fungsional.lektorKepala],
    default: nilai.fungsional.tenagaPengajar,
    require: [true, 'Jabatan fungsional dosen harus diiisi']
  },
  bidang_aplikasi_desktop: {
    type: SchemaTypes.Decimal128,
    enum: [nilai.bidang.tingkat8, nilai.bidang.tingkat7, nilai.bidang.tingkat6, nilai.bidang.tingkat5, 
      nilai.bidang.tingkat4, nilai.bidang.tingkat3, nilai.bidang.tingkat2, nilai.bidang.tingkat1],
    default: nilai.bidang.tingkat8,
    require: [true, 'Tingkat keahlian bidang Aplikasi Desktop dosen harus diiisi']
  },
  bidang_aplikasi_web: {
    type: SchemaTypes.Decimal128,
    enum: [nilai.bidang.tingkat8, nilai.bidang.tingkat7, nilai.bidang.tingkat6, nilai.bidang.tingkat5, 
      nilai.bidang.tingkat4, nilai.bidang.tingkat3, nilai.bidang.tingkat2, nilai.bidang.tingkat1],
    default: nilai.bidang.tingkat8,
    require: [true, 'Tingkat keahlian bidang Aplikasi Web dosen harus diiisi']
  },
  bidang_aplikasi_mobile: {
    type: SchemaTypes.Decimal128,
    enum: [nilai.bidang.tingkat8, nilai.bidang.tingkat7, nilai.bidang.tingkat6, nilai.bidang.tingkat5, 
      nilai.bidang.tingkat4, nilai.bidang.tingkat3, nilai.bidang.tingkat2, nilai.bidang.tingkat1],
    default: nilai.bidang.tingkat8,
    require: [true, 'Tingkat keahlian bidang Aplikasi Mobile dosen harus diiisi']
  },
  bidang_data_mining: {
    type: SchemaTypes.Decimal128,
    enum: [nilai.bidang.tingkat8, nilai.bidang.tingkat7, nilai.bidang.tingkat6, nilai.bidang.tingkat5, 
      nilai.bidang.tingkat4, nilai.bidang.tingkat3, nilai.bidang.tingkat2, nilai.bidang.tingkat1],
    default: nilai.bidang.tingkat8,
    require: [true, 'Tingkat keahlian bidang Data Mining dosen harus diiisi']
  },
  bidang_iot: {
    type: SchemaTypes.Decimal128,
    enum: [nilai.bidang.tingkat8, nilai.bidang.tingkat7, nilai.bidang.tingkat6, nilai.bidang.tingkat5, 
      nilai.bidang.tingkat4, nilai.bidang.tingkat3, nilai.bidang.tingkat2, nilai.bidang.tingkat1],
    default: nilai.bidang.tingkat8,
    require: [true, 'Tingkat keahlian bidang Internet Of Thinks dosen harus diiisi']
  },
  bidang_desain_aplikasi: {
    type: SchemaTypes.Decimal128,
    enum: [nilai.bidang.tingkat8, nilai.bidang.tingkat7, nilai.bidang.tingkat6, nilai.bidang.tingkat5, 
      nilai.bidang.tingkat4, nilai.bidang.tingkat3, nilai.bidang.tingkat2, nilai.bidang.tingkat1],
    default: nilai.bidang.tingkat8,
    require: [true, 'Tingkat keahlian bidang Desain Aplikasi dosen harus diiisi']
  },
  bidang_jaringan_komputer: {
    type: SchemaTypes.Decimal128,
    enum: [nilai.bidang.tingkat8, nilai.bidang.tingkat7, nilai.bidang.tingkat6, nilai.bidang.tingkat5, 
      nilai.bidang.tingkat4, nilai.bidang.tingkat3, nilai.bidang.tingkat2, nilai.bidang.tingkat1],
    default: nilai.bidang.tingkat8,
    require: [true, 'Tingkat keahlian bidang Jaringan Komputer dosen harus diiisi']
  },
  bidang_basis_data: {
    type: SchemaTypes.Decimal128,
    enum: [nilai.bidang.tingkat8, nilai.bidang.tingkat7, nilai.bidang.tingkat6, nilai.bidang.tingkat5, 
      nilai.bidang.tingkat4, nilai.bidang.tingkat3, nilai.bidang.tingkat2, nilai.bidang.tingkat1],
    default: nilai.bidang.tingkat8,
    require: [true, 'Tingkat keahlian bidang Basis Data dosen harus diiisi']
  },
  jumlah: {
    type: SchemaTypes.Decimal128,
    enum: [nilai.jumlah.sangatBanyak, nilai.jumlah.banyak, 
      nilai.jumlah.cukup, nilai.jumlah.kurang, nilai.jumlah.sangatKurang],
    default: nilai.jumlah.cukup,
    require: [true, 'Jumlah bimbingan setiap dosen harus diiisi']
  }
}, { timestamps: true })

module.exports = mongoose.model('Dosen', dosenSchema)