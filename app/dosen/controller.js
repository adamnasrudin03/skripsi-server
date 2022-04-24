const Dosen = require('./model')

module.exports={
  index: async(req, res)=>{
    try {
      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")

      const alert = { message: alertMessage, status: alertStatus}
      const dosen = await Dosen.find().sort({ _id: -1 })

      res.render('admin/dosen/view_dosen',{
        dosen,
        alert,
        title: 'Dosen Pembimbing'
      })
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/dosen')
    }
  },
  
  viewCreate: async(req, res)=>{
    try {
      res.render('admin/dosen/create',{
        title: 'Taambah Dosen Pembimbing'
      })
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/dosen')
    }
  },

  actionCreate : async(req, res)=>{
    try {
      const { nidn, nama, gelar, email, no_wa, 
        pendidikan, fungsional, jumlah, bidang_aplikasi_desktop,
        bidang_aplikasi_web, bidang_aplikasi_mobile, bidang_data_mining,
        bidang_iot, bidang_desain_aplikasi, bidang_jaringan_komputer, 
        bidang_basis_data } = req.body

      let dosen = await Dosen({ nidn, nama, gelar, email, no_wa, 
        pendidikan, fungsional, jumlah, bidang_aplikasi_desktop,
        bidang_aplikasi_web, bidang_aplikasi_mobile, bidang_data_mining,
        bidang_iot, bidang_desain_aplikasi, bidang_jaringan_komputer, 
        bidang_basis_data })
      await dosen.save();

      req.flash('alertMessage', "Berhasil tambah data tdosen pembimbing")
      req.flash('alertStatus', "success")

      res.redirect('/dosen')
      
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/dosen')
    }
  },

  actionStatus: async (req, res) => {
    try {
      const { id } = req.params
      let dosen = await Dosen.findOne({ _id: id })

      let status = dosen.status === 'Y' ? 'N' : 'Y'

      await Dosen.findOneAndUpdate({
        _id: id
      }, { status })

      req.flash('alertMessage', "Berhasil ubah status dosen")
      req.flash('alertStatus', "success")

      res.redirect('/dosen')


    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/dosen')
    }
  },

  viewEdit : async(req, res)=>{
    try {
      const { id } = req.params
      
      const dosen = await Dosen.findOne({_id : id})

      res.render('admin/dosen/edit', {
        dosen,
        title: 'Ubah Dosen Pembimbing'
      })
      
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/dosen')
    }
  },

  actionEdit : async(req, res)=>{
    try {
      const { id } = req.params

      const { nidn, nama, gelar, email, no_wa, 
        pendidikan, fungsional, jumlah, bidang_aplikasi_desktop,
        bidang_aplikasi_web, bidang_aplikasi_mobile, bidang_data_mining,
        bidang_iot, bidang_desain_aplikasi, bidang_jaringan_komputer, 
        bidang_basis_data } = req.body

      await Dosen.findOneAndUpdate({
        _id: id
      },{ nidn, nama, gelar, email, no_wa, 
        pendidikan, fungsional, jumlah, bidang_aplikasi_desktop,
        bidang_aplikasi_web, bidang_aplikasi_mobile, bidang_data_mining,
        bidang_iot, bidang_desain_aplikasi, bidang_jaringan_komputer, 
        bidang_basis_data })

      req.flash('alertMessage', "Berhasil ubah data dosen pembimbing")
      req.flash('alertStatus', "success")

      res.redirect('/dosen')
      
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/dosen')
    }
  },

  actionDelete: async(req, res)=>{
    try {
      const { id } = req.params;

      await Dosen.findOneAndRemove({
        _id: id
      });

      req.flash('alertMessage', "Berhasil hapus data dosen pembimbing")
      req.flash('alertStatus', "success")

      res.redirect('/dosen')
      
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/dosen')
    }
  },
  

}