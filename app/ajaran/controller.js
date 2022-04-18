const Ajaran = require('./model')

module.exports={
  index: async(req, res)=>{
    try {
      const ajaran = await Ajaran.find().sort({ createdAt: -1 })

      res.render('admin/ajaran/view_ajaran',{
        ajaran,
        title: 'Tahun Ajaran'
      })
    } catch (err) {
      console.log("err : ", err)
    }
  },

  viewCreate: async(req, res)=>{
    try {
      res.render('admin/ajaran/create',{
        title: 'Taambah Tahun Ajaran'
      })
    } catch (err) {
      console.log("err : ", err)
    }
  },

  actionCreate : async(req, res)=>{
    try {
      const { start_year, end_year, semester, start_at, end_at } = req.body

      let ajaran = await Ajaran({ start_year, end_year, semester, start_at, end_at })
      await ajaran.save();

      res.redirect('/ajaran')
      
    } catch (err) {
      console.log("err : ", err)
    }
  },

  viewEdit : async(req, res)=>{
    try {
      const { id } = req.params
      
      const ajaran = await Ajaran.findOne({_id : id})

      res.render('admin/ajaran/edit', {
        ajaran,
        title: 'Ubah Tahun Ajaran'
      })
      
    } catch (err) {
      console.log("err : ", err)
    }
  },
  
  actionEdit : async(req, res)=>{
    try {
      const { id } = req.params
      const { start_year, end_year, semester, start_at, end_at } = req.body

      await Ajaran.findOneAndUpdate({
        _id: id
      },{ start_year, end_year, semester, start_at, end_at });

      res.redirect('/ajaran');
      
    } catch (err) {
      console.log("err : ", err)
    }
  },
  
  actionDelete: async(req, res)=>{
    try {
      const { id } = req.params;

      await Ajaran.findOneAndRemove({
        _id: id
      });

      res.redirect('/ajaran')
      
    } catch (err) {
      console.log("err : ", err)
    }
  }

}