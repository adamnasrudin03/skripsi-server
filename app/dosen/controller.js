const Dosen = require('./model')
const Mahasiswa = require('./../mahasiswa/model')
const { validateEmail } = require('../../helpers')

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
        admin: req.session.user,
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
        admin: req.session.user,
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

      if(!validateEmail(email)) {
        req.flash('alertMessage', `Format email yang anda masukan tidak sesuai.`)
        req.flash('alertStatus', 'danger')
        res.redirect('/dosen')
        return;
      }

      let formatWA;
      //check phone input [first chart input 62 or 0]
      if(no_wa.charAt(0) === "6" && no_wa.charAt(1) === "2") {
        formatWA = "62" + no_wa.substr(2, no_wa.length);
      } else if(no_wa.charAt(0) === "0") {
        formatWA = "62" + no_wa.substr(1, no_wa.length);
      } else if(no_wa === "") {
        formatWA = no_wa;
      } else {
        formatWA = "62" + no_wa;
      }

      let dosen = await Dosen({ nidn, nama, gelar, email, no_wa: formatWA, 
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
      
      let dosen = await Dosen.findOne({_id : id})

      //check no_wa res [delete first chart  62 or 0]
      if(dosen.no_wa.charAt(0) === "6" && dosen.no_wa.charAt(1) === "2") {
        dosen.no_wa =  dosen.no_wa.substr(2, dosen.no_wa.length);
      } else if(dosen.no_wa.charAt(0) === "0") {
        dosen.no_wa =  dosen.no_wa.substr(1, dosen.no_wa.length);
      } 

      res.render('admin/dosen/edit', {
        dosen,
        admin: req.session.user,
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

      if(!validateEmail(email)) {
        req.flash('alertMessage', `Format email yang anda masukan tidak sesuai.`)
        req.flash('alertStatus', 'danger')
        res.redirect('/dosen')
        return;
      }
      
      let formatWA;
      //check phone input [first chart input 62 or 0]
      if(no_wa.charAt(0) === "6" && no_wa.charAt(1) === "2") {
        formatWA = "62" + no_wa.substr(2, no_wa.length);
      } else if(no_wa.charAt(0) === "0") {
        formatWA = "62" + no_wa.substr(1, no_wa.length);
      } else if(no_wa === "") {
        formatWA = no_wa;
      } else {
        formatWA = "62" + no_wa;
      }

      await Dosen.findOneAndUpdate({
        _id: id
      },{ nidn, nama, gelar, email, no_wa: formatWA, 
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

      const mahasiswa = await Mahasiswa.find({dosen: id}).count()
      if (mahasiswa > 0) {
        req.flash('alertMessage', "Data tidak dapat dihapus, karena relasi dengan data lain.")
        req.flash('alertStatus', "danger")
  
        res.redirect('/dosen')
        return
      }

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