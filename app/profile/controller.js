

module.exports = {
  index: async (req, res) => {
    try {

      res.render('auth/view_profile', {
        title: 'Detail Profile',
        name: req.session.user.name,
        admin: req.session.user
      })
    } catch (err) {
      console.log(err)

    }
  },
  
  viewEdit : async(req, res)=>{
    try {
      res.render('auth/edit', {
        title: 'Ubah Profile',
        name: req.session.user.name,
        admin: req.session.user
      })
      
    } catch (err) {
      console.log(err)
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/ajaran')
    }
  },

  viewChangePassword: async (req, res) => {
    try {

      res.render('auth/change_password', {
        name: req.session.user.name,
        title: 'Ganti Kata Sandi',
      })
    } catch (err) {
      console.log(err)

    }
  },
  
}