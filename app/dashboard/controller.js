const Dosen = require('./../dosen/model')
const Mahasiswa = require('./../mahasiswa/model')

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")
      const alert = { message: alertMessage, status: alertStatus}

      const dosen = await Dosen.find({status: "Y"}).count()
      const accepted = await Mahasiswa.find({status: "accepted"}).count()
      const rejected = await Mahasiswa.find({status: "rejected"}).count()
      const pending = await Mahasiswa.find({status: "pending"}).count()

      res.render('admin/dashboard/view_dashboard', {
        admin: req.session.user,
        alert,
        title: 'Dashboard',
        count: {
          pending: pending,
          accepted: accepted,
          rejected: rejected,
          dosenActive: dosen
        }
      })
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/dashboard')
    }
  }
}