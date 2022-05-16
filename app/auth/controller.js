const User = require('./model')
const bcrypt = require('bcryptjs')


module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")

      const alert = { message: alertMessage, status: alertStatus }
      if (req.session.user === null || req.session.user === undefined) {
        res.render('auth/view_signin', {
          alert,
          title : 'Halaman signin'
        })
      } else {
        res.redirect('/dashboard')
      }
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/')

    }
  },

  actionSignin: async (req, res) => {
    try {
      const { email, password } = req.body
      const check = await User.findOne({ email: email })

      if (check) {
        if (check.status === 'Y') {
          const checkPassword = await bcrypt.compare(password, check.password)
          if (checkPassword) {
            req.session.user = {
              id: check._id,
              email: check.email,
              status: check.status,
              name: check.name,
              gender: check.gender,
              role: check.role,
              phoneNumber: check.phoneNumber,
              avatar: check.avatar
            }
            res.redirect('/dashboard')
          } else {
            req.flash('alertMessage', `Kata sandi yang anda inputkan salah`)
            req.flash('alertStatus', 'danger')
            res.redirect('/')
          }

        } else {
          req.flash('alertMessage', `Mohon maaf status anda belum aktif`)
          req.flash('alertStatus', 'danger')
          res.redirect('/')
        }

      } else {
        req.flash('alertMessage', `Email yang anda inputkan tidak terdaftar`)
        req.flash('alertStatus', 'danger')
        res.redirect('/')
      }

    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/')
    }
  },

  actionLogout : (req, res)=>{
    req.session.destroy();
    res.redirect('/')
  },

  apiRegister: async (req, res) => {
    try {
      const { email, password, name, gender, role, phoneNumber } = req.body

      if (!email) {
        res.status(400).json({ message: `Harap masukan email anda`, data: undefined })
        return;
      }

      if (!password) {
        res.status(400).json({ message: `Harap masukan kata sandi anda`, data: undefined })
        return;
      }

      if (!name) {
        res.status(400).json({ message: `Harap masukan nama lengkap anda`, data: undefined })
        return;
      }

      if (!phoneNumber) {
        res.status(400).json({ message: `Harap masukan nomor handphone anda`, data: undefined })
        return;
      }

      if (!gender) {
        res.status(400).json({ message: `Harap masukan nomor Jenis Kelamin anda`, data: undefined })
        return;
      }

      const check = await User.findOne({ email: email })

      if (!check) {
        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        let hashPassword = await bcrypt.hash(password, salt);

        let user = await User({ email, password: hashPassword, name, role, phoneNumber })
        await user.save();

        res.status(200).json({ message: 'ok', data: user })
      } else {
        res.status(400).json({ message: `Email yang anda inputkan sudah terdaftar`, data: undefined })
      }

    } catch (err) {
      res.status(500).json({ message: err.message || `Internal server error`, data: undefined })
    }
  },
}