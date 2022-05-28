module.exports = {
  isLoginAdmin: (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      req.flash('alertMessage', `Mohon maaf session anda telah habis silahkan login kembali`)
      req.flash('alertStatus', 'danger')
      res.redirect('/')
    } else {
      next()
    }
  },

  isLoginSuperAdmin: (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      req.flash('alertMessage', `Mohon maaf session anda telah habis silahkan login kembali`)
      req.flash('alertStatus', 'danger')
      res.redirect('/')
    } else if (req.session.user.role !== 'super_admin') {
      req.flash('alertMessage', `Mohon maaf anda tidak dapat akses fitur tersebut`)
      req.flash('alertStatus', 'danger')
      res.redirect('/dashboard')
    } else {
      next()
    }
  },

}