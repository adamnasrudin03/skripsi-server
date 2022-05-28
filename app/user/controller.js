const User = require('./../auth/model')
const { validateEmail } = require('../../helpers')
const bcrypt = require('bcryptjs')

module.exports={
  index: async(req, res)=>{
    try {
      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")

      const alert = { message: alertMessage, status: alertStatus}
      const user = await User.find().sort({ _id: -1 })

      res.render('admin/user/view_user',{
        user,
        alert,
        admin: req.session.user,
        title: 'User'
      })
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/user')
    }
  },
  
  viewCreate: async(req, res)=>{
    try {
      res.render('admin/user/create',{
        admin: req.session.user,
        title: 'Tambah User'
      })
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/user')
    }
  },

  actionCreate : async(req, res)=>{
    try {
      const { email, name, role, 
        password, gender,  phoneNumber } = req.body

      if(!validateEmail(email)) {
        req.flash('alertMessage', `Format email yang anda masukan tidak sesuai.`)
        req.flash('alertStatus', 'danger')
        res.redirect('/user')
        return;
      }

      let formatWA;
      //check phone input [first chart input 62 or 0]
      if(phoneNumber.charAt(0) === "6" && phoneNumber.charAt(1) === "2") {
        formatWA = "62" + phoneNumber.substr(2, phoneNumber.length);
      } else if(phoneNumber.charAt(0) === "0") {
        formatWA = "62" + phoneNumber.substr(1, phoneNumber.length);
      } else if(phoneNumber === "") {
        formatWA = phoneNumber;
      } else {
        formatWA = "62" + phoneNumber;
      }
      
      const check = await User.findOne({ email: email })

      if (!check) {
        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        let hashPassword = await bcrypt.hash(password, salt);

        let user = await User({ email, password: hashPassword, name, gender, role, phoneNumber: formatWA })
        await user.save();

        req.flash('alertMessage', "Berhasil tambah data user")
        req.flash('alertStatus', "success")
  
        res.redirect('/user')
        return;
      } else {
        req.flash('alertMessage', "Email yang anda inputkan sudah terdaftar")
        req.flash('alertStatus', "danger")
  
        res.redirect('/user')
        return;
      }
      
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/user')
    }
  },

  actionStatus: async (req, res) => {
    try {
      const { id } = req.params
      let user = await User.findOne({ _id: id })

      let status = user.status === 'Y' ? 'N' : 'Y'

      await User.findOneAndUpdate({
        _id: id
      }, { status })

      req.flash('alertMessage', "Berhasil ubah status user")
      req.flash('alertStatus', "success")

      res.redirect('/user')


    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/user')
    }
  },

  viewEdit : async(req, res)=>{
    try {
      const { id } = req.params
      
      let user = await User.findOne({_id : id})

      //check phoneNumber res [delete first chart  62 or 0]
      if(user.phoneNumber.charAt(0) === "6" && user.phoneNumber.charAt(1) === "2") {
        user.phoneNumber =  user.phoneNumber.substr(2, user.phoneNumber.length);
      } else if(user.phoneNumber.charAt(0) === "0") {
        user.phoneNumber =  user.phoneNumber.substr(1, user.phoneNumber.length);
      } 

      res.render('admin/user/edit', {
        user,
        admin: req.session.user,
        title: 'Ubah User'
      })
      
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/user')
    }
  },

  actionEdit : async(req, res)=>{
    try {
      const { id } = req.params

      const checkById = await User.findOne({ _id: id });
      if (!checkById) {
        req.flash('alertMessage', `Data tidak terdaftar`)
        req.flash('alertStatus', 'danger')
        res.redirect('/user')
        return;
      }

      const { email, name, role, password, gender,  phoneNumber } = req.body

      if(!validateEmail(email)) {
        req.flash('alertMessage', `Format email yang anda masukan tidak sesuai.`)
        req.flash('alertStatus', 'danger')
        res.redirect('/user')
        return;
      }
      
      const checkByEmail = await User.findOne({ email: email })
      
      if (checkByEmail && (checkByEmail._id.toString() !== checkById._id.toString())) {
        req.flash('alertMessage', `Email yang anda inputkan sudah terdaftar`)
        req.flash('alertStatus', 'danger')
        res.redirect('/user')
        return;
      }

      let formatWA;
      //check phone input [first chart input 62 or 0]
      if(phoneNumber.charAt(0) === "6" && phoneNumber.charAt(1) === "2") {
        formatWA = "62" + phoneNumber.substr(2, phoneNumber.length);
      } else if(phoneNumber.charAt(0) === "0") {
        formatWA = "62" + phoneNumber.substr(1, phoneNumber.length);
      } else if(phoneNumber === "") {
        formatWA = phoneNumber;
      } else {
        formatWA = "62" + phoneNumber;
      }

      await User.findOneAndUpdate({
        _id: id
      },{ phoneNumber: formatWA,
        email, name, role, password, gender})

      req.flash('alertMessage', "Berhasil ubah data user")
      req.flash('alertStatus', "success")

      res.redirect('/user')
      
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/user')
    }
  },

  actionDelete: async(req, res)=>{
    try {
      const { id } = req.params;

      const user = await User.findOne({ _id: id })

      if (user.status == 'Y') {
        req.flash('alertMessage', "Data tidak dapat dihapus, karena user masih aktif.")
        req.flash('alertStatus', "danger")
  
        res.redirect('/user')
        return;
      }

      if (user.role == 'super_admin') {
        req.flash('alertMessage', "Data tidak dapat dihapus, karena akses user tersebut Super Admin.")
        req.flash('alertStatus', "danger")
  
        res.redirect('/user')
        return;
      }

      await User.findOneAndRemove({
        _id: id
      });

      req.flash('alertMessage', "Berhasil hapus data user")
      req.flash('alertStatus', "success")

      res.redirect('/user')
      
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/user')
    }
  },
  

}