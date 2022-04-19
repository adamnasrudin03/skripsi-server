

module.exports = {
  index: async (req, res) => {
    try {

      res.render('auth/view_profile', {
        title: 'Detail Profile',
        admin: {
          full_name: 'Adam Nasrudin',
          email: 'admin@gmail.com',
          gender: 'male',
          role: 'super_admin'
        }
      })
    } catch (err) {
      console.log(err)

    }
  },
  
  viewEdit : async(req, res)=>{
    try {
      res.render('auth/edit', {
        title: 'Ubah Profile',
        admin: {
          full_name: 'Adam Nasrudin',
          email: 'admin@gmail.com',
          gender: 'male',
          role: 'super_admin'
        }
      })
      
    } catch (err) {
      console.log(err)
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/ajaran')
    }
  },
  
}