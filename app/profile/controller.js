const User = require('./../users/model')
const bcrypt = require('bcryptjs')

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")
      const alert = { message: alertMessage, status: alertStatus}

      res.render('auth/view_profile', {
        title: 'Detail Profile',
        alert,
        name: req.session.user.name,
        admin: req.session.user
      })
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/profile')
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
      res.redirect('/profile')
    }
  },

  actionEdit : async(req, res)=>{
    try {
      const { id } = req.params;
      
      const checkById = await User.findOne({ _id: id });
      if (!checkById) {
        req.flash('alertMessage', `Data tidak terdaftar`)
        req.flash('alertStatus', 'danger')
        res.redirect('/profile')
        return;
      }

      const { email, name, gender, phoneNumber} = req.body;

      const checkByEmail = await User.findOne({ email: email })
      
      if (checkByEmail && (checkByEmail._id.toString() !== checkById._id.toString())) {
        req.flash('alertMessage', `Email yang anda inputkan sudah terdaftar`)
        req.flash('alertStatus', 'danger')
        res.redirect('/profile')
        return;
      }

      if(req.image){
        let tmp_path= req.file.path;
        let originaExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
        let filename = req.file.filename + '.' + originaExt;
        let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`)

        const src = fs.createReadStream(tmp_path)
        const dest = fs.createWriteStream(target_path)

        src.pipe(dest)

        src.on('end', async ()=>{
          try {
            const check = await User.findOne({_id: id})

            let currentImage = `${config.rootPath}/public/uploads/${check.thumbnial}`;
            if(fs.existsSync(currentImage)){
              fs.unlinkSync(currentImage)
            }

            await User.findOneAndUpdate({
              _id: id
            },{ 
              email, 
              gender, 
              name, 
              phoneNumber,
              thumbnial: filename
             })
             
            const user = await User.findOne({_id: id})

            req.session.user = {
              id: user._id,
              email: user.email,
              status: user.status,
              name: user.name,
              gender: user.gender,
              role: user.role,
              phoneNumber: user.phoneNumber,
              thumbnial: user.thumbnial
            }
      
            req.flash('alertMessage', "Berhasil ubah data profile")
            req.flash('alertStatus', "success")
      
            res.redirect('/profile')
            
          } catch (err) {
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/profile')
          }
        })
      } else {
        await User.findOneAndUpdate({
          _id: id
        },{ email, gender, name, phoneNumber })
  
        const user = await User.findOne({_id: id})

        req.session.user = {
          id: user._id,
          email: user.email,
          status: user.status,
          name: user.name,
          gender: user.gender,
          role: user.role,
          phoneNumber: user.phoneNumber,
          thumbnial: user.thumbnial
        }
        
        req.flash('alertMessage', "Berhasil ubah data profile")
        req.flash('alertStatus', "success")
  
        res.redirect('/profile')
      }
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/profile')
    }
  },

  viewChangePassword: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")
      const alert = { message: alertMessage, status: alertStatus}

      res.render('auth/change_password', {
        name: req.session.user.name,
        title: 'Ganti Kata Sandi',
        alert,
        admin: req.session.user
      })
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/profile')

    }
  },

  actionChangePassword : async(req, res)=>{
    try {
      const { id } = req.params;
      
      const checkById = await User.findOne({ _id: id });
      if (!checkById) {
        req.flash('alertMessage', `Data tidak terdaftar`)
        req.flash('alertStatus', 'danger')
        res.redirect('/profile/change-password')
        return;
      }

      const { oldPassword, newPassword, confirmPassword } = req.body;

      if(newPassword !== confirmPassword) {
        req.flash('alertMessage', `Konfirmasi kata sandi anda tidak sesuai`)
        req.flash('alertStatus', 'danger')
        res.redirect('/profile/change-password')
        return;
      }

      const checkPassword = await bcrypt.compare(oldPassword, checkById.password);
      if(!checkPassword) {
        req.flash('alertMessage', `Kata sandi saat ini yang anda inputkan salah`)
        req.flash('alertStatus', 'danger')
        res.redirect('/profile/change-password')
        return;
      }

      // generate salt to hash password
      const salt = await bcrypt.genSalt(10);
      // now we set user password to hashed password
      let hashPassword = await bcrypt.hash(newPassword, salt);

      await User.findOneAndUpdate({
        _id: id
      },{ password: hashPassword })

      req.flash('alertMessage', "Berhasil ubah kata sandi, silahkan login kembali")
      req.flash('alertStatus', "success")

      res.redirect('/profile/change-password')
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/profile/change-password')
    }
  },
  
}