const Mahasiswa = require('./model')
const path = require('path')
const fs = require('fs')
const config = require('../../config')

module.exports={
  index: async(req, res)=>{
    try {
      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")

      const alert = { message: alertMessage, status: alertStatus}
      const mahasiswa = await Mahasiswa.find().sort({ _id: -1 }).populate({
        'path':'ajaran',
        'model':'Ajaran'
     })

      res.render('admin/mahasiswa/view_mahasiswa',{
        mahasiswa,
        alert,
        title: 'Pengajuan Proposal Skripsi'
      })
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/mahasiswa')
    }
  },
  
  actionStatusReject: async (req, res) => {
    try {
      const { id } = req.params
      await Mahasiswa.findOneAndUpdate({
        _id: id
      }, { status: 'rejected' })

      req.flash('alertMessage', "Berhasil ubah status pengajuan skripsi")
      req.flash('alertStatus', "success")

      res.redirect('/mahasiswa')


    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/mahasiswa')
    }
  },

  viewEdit : async(req, res)=>{
    try {
      const { id } = req.params
      
      const mahasiswa = await Mahasiswa.findOne({_id : id}).populate({
        'path':'ajaran',
        'model':'Ajaran'
     })
      res.render('admin/mahasiswa/edit', {
        mahasiswa,
        title: 'Ubah Pengajuan Peoposal'
      })
      
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/mahasiswa')
    }
  },

  viewDetail : async(req, res)=>{
    try {
      const { id } = req.params
      
      const mahasiswa = await Mahasiswa.findOne({_id : id}).populate({
        'path':'ajaran',
        'model':'Ajaran'
     })
      res.render('admin/mahasiswa/detail', {
        mahasiswa,
        title: 'Detail Pengajuan Peoposal'
      })
      
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/mahasiswa')
    }
  },

  apiActionCreate : async(req, res)=>{
    try {
      const { npm, nama, semester, email, no_wa, 
        judul_skripsi, tema_skripsi, file_proposal, file_rekap_nilai,
        mata_kuliah_lain, dosen_sebelum, ajaran, lanjutan } = req.body

      let mahasiswa = await Mahasiswa({ npm, nama, semester, email, no_wa, 
        judul_skripsi, tema_skripsi, file_proposal, file_rekap_nilai,
        mata_kuliah_lain, dosen_sebelum, ajaran, lanjutan })
      await mahasiswa.save();

      res.status(200).json({ message: 'ok', data: mahasiswa })

    } catch (err) {
      res.status(500).json({ message: err.message || `Internal server error` , data: undefined })
    }
  },
  
  apiUploadProposal: async (req, res) => {
    try {
      if(req.file){
        let tmp_path= req.file.path;
        let originaExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
        let name = req.file.originalname.split('.');
        let filename = req.file.filename + '_' +  name[0] + '.' + originaExt;
        let target_path = path.resolve(config.rootPath, `public/uploads/proposal/${filename}`)

        const src = fs.createReadStream(tmp_path)
        const dest = fs.createWriteStream(target_path)

        src.pipe(dest)

        src.on('end', async ()=>{
          try {
            res.status(200).json({ message: 'ok', data: {
              uri: filename
            } })
            
          } catch (err) {
            res.status(500).json({ message: err.message || `Internal server error` , data: undefined })
          }
        })
      } else {
        res.status(400).json({ message: `Request Payload Tidak Valid` , data: undefined })
      }

    } catch (err) {
      res.status(500).json({ message: err.message || `Internal server error` , data: undefined })
    }
  },

  apiUploadRekap: async (req, res) => {
    try {
      if(req.file){
        let tmp_path= req.file.path;
        let originaExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
        let name = req.file.originalname.split('.');
        let filename = req.file.filename + '_' +  name[0] + '.' + originaExt;
        let target_path = path.resolve(config.rootPath, `public/uploads/rekap/${filename}`)

        const src = fs.createReadStream(tmp_path)
        const dest = fs.createWriteStream(target_path)

        src.pipe(dest)

        src.on('end', async ()=>{
          try {
            res.status(200).json({ message: 'ok', data: {
              uri: filename
            } })
            
          } catch (err) {
            res.status(500).json({ message: err.message || `Internal server error` , data: undefined })
          }
        })
      } else {
        res.status(400).json({ message: `Request Payload Tidak Valid` , data: undefined })
      }

    } catch (err) {
      res.status(500).json({ message: err.message || `Internal server error` , data: undefined })
    }
  },
}