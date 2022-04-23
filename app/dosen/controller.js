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

}