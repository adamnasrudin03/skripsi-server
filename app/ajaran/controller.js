
module.exports={
  index: async(req, res)=>{
    try {
      res.render('admin/ajaran/view_ajaran',{
        title: 'Tahun Ajaran'
      })
    } catch (err) {
      console.log("err : ", err)
    }
  }
}