const Ajaran = require('./model')

module.exports={
  index: async(req, res)=>{
    try {
      res.render('admin/ajaran/view_ajaran',{
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
}