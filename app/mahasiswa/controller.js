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

}