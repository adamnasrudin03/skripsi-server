const Dosen = require('./../dosen/model')
const Mahasiswa = require('./../mahasiswa/model')

module.exports = {
  index: async (req, res) => {
    try {

      const dosen = await Dosen.find({status: "Y"}).count()
      const accepted = await Mahasiswa.find({status: "accepted"}).count()
      const rejected = await Mahasiswa.find({status: "rejected"}).count()
      const pending = await Mahasiswa.find({status: "pending"}).count()

      res.render('admin/dashboard/view_dashboard', {
        name: 'admin',
        title: 'Halaman Dashboard',
        count: {
          pending: pending,
          accepted: accepted,
          rejected: rejected,
          dosenActive: dosen
        }
      })
    } catch (err) {
      console.log(err)

    }
  }
}