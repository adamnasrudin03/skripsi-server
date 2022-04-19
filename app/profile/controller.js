

module.exports = {
  index: async (req, res) => {
    try {

      res.render('auth/view_profile', {
        name: 'admin',
        title: 'Halaman Dashboard',
        count: {
          pending: 1,
          accepted: 2,
          rejected: 3,
          dosenActive: 4
        }
      })
    } catch (err) {
      console.log(err)

    }
  }
}