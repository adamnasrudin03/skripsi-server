const Mahasiswa = require('./model')

module.exports={
  index: async(req, res)=>{
    try {
      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")

      const alert = { message: alertMessage, status: alertStatus}
      const mahasiswa = await Mahasiswa.find().sort({ _id: -1 })

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

  apiActionCreate : async(req, res)=>{
    try {
      const { npm, nama, semester, email, no_wa, 
        judul_skripsi, tema_skripsi, file_proposal, file_rekap_nilai,
        mata_kuliah_lain, dosen_sebelum, ajaran_id, lanjutan } = req.body

      let mahasiswa = await Mahasiswa({ npm, nama, semester, email, no_wa, 
        judul_skripsi, tema_skripsi, file_proposal, file_rekap_nilai,
        mata_kuliah_lain, dosen_sebelum, ajaran_id, lanjutan })
      await mahasiswa.save();

      res.status(200).json({ message: 'ok', data: mahasiswa })
    } catch (err) {
      res.status(500).json({ message: err.message || `Internal server error` , data: undefined })
    }
  },

}