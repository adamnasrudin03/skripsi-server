const Dosen = require('./../dosen/model')

module.exports = {
  index: async (req, res) => {
    try {

      const dosen = await Dosen.find({status: "Y"}).count()

      res.render('admin/dashboard/view_dashboard', {
        name: 'admin',
        title: 'Halaman Dashboard',
        count: {
          pending: 1,
          accepted: 2,
          rejected: 3,
          dosenActive: dosen
        }
      })
    } catch (err) {
      console.log(err)

    }
  }
}