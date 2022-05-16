const Ajaran = require('./model')
const Mahasiswa = require('./../mahasiswa/model')

module.exports={
  index: async(req, res)=>{
    try {
      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")

      const alert = { message: alertMessage, status: alertStatus}
      const ajaran = await Ajaran.find().sort({ createdAt: -1 })

      console.log("alert >>")
      console.log(alert)

      res.render('admin/ajaran/view_ajaran',{
        ajaran,
        alert,
        admin: req.session.user,
        title: 'Tahun Ajaran'
      })
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/ajaran')
    }
  },

  viewCreate: async(req, res)=>{
    try {
      res.render('admin/ajaran/create',{
        admin: req.session.user,
        title: 'Taambah Tahun Ajaran'
      })
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/ajaran')
    }
  },

  actionCreate : async(req, res)=>{
    try {
      const { start_year, end_year, semester, start_at, end_at } = req.body

      let ajaran = await Ajaran({ start_year, end_year, semester, start_at, end_at })
      await ajaran.save();

      req.flash('alertMessage', "Berhasil tambah data tahun ajaran")
      req.flash('alertStatus', "success")

      res.redirect('/ajaran')
      
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/ajaran')
    }
  },

  viewEdit : async(req, res)=>{
    try {
      const { id } = req.params
      
      const ajaran = await Ajaran.findOne({_id : id})

      res.render('admin/ajaran/edit', {
        ajaran,
        admin: req.session.user,
        title: 'Ubah Tahun Ajaran'
      })
      
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/ajaran')
    }
  },
  
  actionEdit : async(req, res)=>{
    try {
      const { id } = req.params
      const { start_year, end_year, semester, start_at, end_at } = req.body

      await Ajaran.findOneAndUpdate({
        _id: id
      },{ start_year, end_year, semester, start_at, end_at });

      req.flash('alertMessage', "Berhasil ubah data tahun ajaran")
      req.flash('alertStatus', "success")

      res.redirect('/ajaran');
      
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/ajaran')
    }
  },
  
  actionDelete: async(req, res)=>{
    try {
      const { id } = req.params;

      const mahasiswa = await Mahasiswa.find({ajaran: id}).count()
      if (mahasiswa > 0) {
        req.flash('alertMessage', "Data tidak dapat dihapus, karena relasi dengan data lain.")
        req.flash('alertStatus', "danger")
  
        res.redirect('/ajaran')
        return
      }

      await Ajaran.findOneAndRemove({
        _id: id
      });

      req.flash('alertMessage', "Berhasil hapus data tahun ajaran")
      req.flash('alertStatus', "success")

      res.redirect('/ajaran')
      
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/ajaran')
    }
  },
  
  apiListAjaran: async (req, res) => {
    try {
      const ajaran = await Ajaran.find().sort({ createdAt: -1 }).limit(5)

      res.status(200).json({ message: 'ok', data: ajaran })
    } catch (err) {
      res.status(500).json({ message: err.message || `Internal server error` , data: [] })
    }
  },

}