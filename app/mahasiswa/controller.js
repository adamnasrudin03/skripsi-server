const Mahasiswa = require('./model')
const Dosen = require('./../dosen/model')
const nilai = require('./../dosen/nilai');
const path = require('path')
const fs = require('fs')
const config = require('../../config')

async function getMax(dataDosen) {
  // Simpan data nilai maksimal dari data dosen yang ada sesuai kriteria
  const maxPendidikan = await Math.max.apply(Math, dataDosen.map(function(o) { 
    return o.pendidikan; 
  }));

  const maxFungsional = await Math.max.apply(Math, dataDosen.map(function(o) { 
    return o.fungsional; 
  }));

  const maxJumlah = await Math.max.apply(Math, dataDosen.map(function(o) { 
    return o.jumlah; 
  }));

  const maxAppDesktop = await Math.max.apply(Math, dataDosen.map(function(o) { 
    return o.bidang_aplikasi_desktop; 
  }));

  const maxAppWeb = await Math.max.apply(Math, dataDosen.map(function(o) { 
    return o.bidang_aplikasi_web; 
  }));

  const maxAppMobile = await Math.max.apply(Math, dataDosen.map(function(o) { 
    return o.bidang_aplikasi_mobile; 
  }));

  const maxDataMining = await Math.max.apply(Math, dataDosen.map(function(o) { 
    return o.bidang_data_mining; 
  }));

  const maxIOT = await Math.max.apply(Math, dataDosen.map(function(o) { 
    return o.bidang_iot; 
  }));

  const maxDesainApp = await Math.max.apply(Math, dataDosen.map(function(o) { 
    return o.bidang_desain_aplikasi; 
  }));

  const maxJarKom = await Math.max.apply(Math, dataDosen.map(function(o) { 
    return o.bidang_jaringan_komputer; 
  }));

  const maxBasisData = await Math.max.apply(Math, dataDosen.map(function(o) { 
    return o.bidang_basis_data; 
  }));

  var obj = {
    pendidikan:  maxPendidikan,
    fungsional: maxFungsional,
    jumlah: maxJumlah,
    bidangAplikasiDesktop: maxAppDesktop,
    bidanAplikasiWeb: maxAppWeb,
    bidangAplikasiMobile: maxAppMobile,
    bidangDataMining: maxDataMining,
    bidangIOT: maxIOT,
    bidangDesainAplikasi: maxDesainApp,
    bidangJarKom: maxJarKom,
    bidangBasisData: maxBasisData,
  };
  
  // Return it
  return obj;
}

async function validasiJumlah(dataDosen, mahasiswa) {
  let temp = [];

  // validasi jumlah bimbingan
  for (let i = 0; i < dataDosen.length; i++) {
    const kuotaDosen = await Mahasiswa.find({ 
      dosen: dataDosen[i]._id,
      ajaran: mahasiswa.ajaran 
      }).count()

    let jumlah = parseFloat(dataDosen[i].jumlah) ;
    let max = kuotaDosen;

    if (jumlah === nilai.jumlah.sangatBanyak) {
      max = 25;
    }
    if (jumlah === nilai.jumlah.banyak) {
      max = 20;
    }
    if (jumlah === nilai.jumlah.cukup) {
      max = 15;
    }
    if (jumlah === nilai.jumlah.kurang) {
      max = 10;
    }
    if (jumlah === nilai.jumlah.sangatKurang) {
      max = 5;
    }

    // simpan data dosen yang memenuhi kriteria jumlah bimbingan
    // kedalam data array baru
    if( kuotaDosen < max || kuotaDosen === 0 ) {
      temp.push(dataDosen[i]);
    }

  }
  // Return it
  return temp;
}

function normalisasi(dataDosen, nilaiMax, mahasiswa) {
  let temp = [];
 
  // Proses Normalisasi Nilai
  for (let j = 0; j < dataDosen.length; j++) {
    // Normalisasi kriteria pendidikan
    let c1 = {
      nilai: dataDosen[j].pendidikan / nilaiMax.pendidikan
    }

    // Normalisasi kriteria fungsional
    let c2 = {
      nilai: dataDosen[j].fungsional / nilaiMax.fungsional
    }

    // Normalisasi kriteria Kompetensi / tema
    let c3 = {
      nilai: 0
    }

    switch (mahasiswa.tema_skripsi) {
      case 'bidang_aplikasi_desktop':
        c3.nilai =  dataDosen[j].bidang_aplikasi_desktop / nilaiMax.bidangAplikasiDesktop;
        break;
    
      case 'bidang_aplikasi_web':
        c3.nilai =  dataDosen[j].bidang_aplikasi_web / nilaiMax.bidanAplikasiWeb;
        break;
    
      case 'bidang_aplikasi_mobile':
        c3.nilai =  dataDosen[j].bidang_aplikasi_mobile / nilaiMax.bidangAplikasiMobile;
        break;
    
      case 'bidang_data_mining':
        c3.nilai =  dataDosen[j].bidang_data_mining / nilaiMax.bidangDataMining;
        break;
    
      case 'bidang_iot':
        c3.nilai =  dataDosen[j].bidang_iot / nilaiMax.bidangIOT;
        break;
    
      case 'bidang_desain_aplikasi':
        c3.nilai =  dataDosen[j].bidang_desain_aplikasi / nilaiMax.bidangDesainAplikasi;
        break;
    
      case 'bidang_jaringan_komputer':
        c3.nilai =  dataDosen[j].bidang_jaringan_komputer / nilaiMax.bidangJarKom;
        break;
    
      case 'bidang_basis_data':
        c3.nilai =  dataDosen[j].bidang_basis_data / nilaiMax.bidangBasisData;
        break;
      
      default:
        c3.nilai =  0;
        break;
    }

    // Normalisasi kriteria jumlah
    let c4 = {
      nilai: dataDosen[j].jumlah / nilaiMax.jumlah
    }

    let normalisasi = {
      id: dataDosen[j]._id,
      nidn: dataDosen[j].nidn,
      nama: dataDosen[j].nama,
      gelar: dataDosen[j].gelar,
      c1: c1,
      c2: c2,
      c3: c3,
      c4: c4
    }

    temp.push(normalisasi)
  }

  // Return it
  return temp;
}

async function perangkingan(normalisasiDosen) {
  let temp = [];
 
  // Proses Final Perankingan
  for (let k = 0; k < normalisasiDosen.length; k++) {
    let a = (nilaiKriteria.c1 * normalisasiDosen[k].c1.nilai) + (nilaiKriteria.c2 * normalisasiDosen[k].c2.nilai);
    let b = (nilaiKriteria.c3 * normalisasiDosen[k].c3.nilai) + (nilaiKriteria.c4 * normalisasiDosen[k].c4.nilai) ;

    let v = {
      nilai: a + b
    };

    let perangkingan = {
      id: normalisasiDosen[k].id,
      nidn: normalisasiDosen[k].nidn,
      nama: normalisasiDosen[k].nama,
      gelar: normalisasiDosen[k].gelar,
      nilai: v.nilai
    };

    temp.push(perangkingan);
    
  }
  
  temp.sort(function (a, b) {
    return b.nilai - a.nilai;
  });

  // Return it
  return temp;
}

const nilaiKriteria = {
  c1: 0.25,
  c2: 0.50,
  c3: 1,
  c4: 0.75
}

module.exports={
  index: async(req, res)=>{
    try {
      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")

      const alert = { message: alertMessage, status: alertStatus}
      const mahasiswa = await Mahasiswa.find().sort({ _id: -1 })
        .populate({
          'path':'ajaran',
          'model':'Ajaran'
        })
        .populate({
          'path':'dosen',
          'model':'Dosen'
        })

      res.render('admin/mahasiswa/view_mahasiswa',{
        mahasiswa,
        alert,
        title: 'Pengajuan Proposal Skripsi'
      })
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/mahasiswa')
    }
  },
  
  actionStatusReject: async (req, res) => {
    try {
      const { id } = req.params
      await Mahasiswa.findOneAndUpdate({
        _id: id
      }, { status: 'rejected' })

      req.flash('alertMessage', "Berhasil ubah status pengajuan skripsi")
      req.flash('alertStatus', "success")

      res.redirect('/mahasiswa')


    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/mahasiswa')
    }
  },
  
  viewDetail : async(req, res)=>{
    try {
      const { id } = req.params
      
      const mahasiswa = await Mahasiswa.findOne({_id : id})
        .populate({
          'path':'ajaran',
          'model':'Ajaran'
        })
        .populate({
          'path':'dosen',
          'model':'Dosen'
        })

      const dosen = await Dosen.find({status: "Y"});

      // Proses validasi filter jumlah bimbingan
      const dosenByJumlah = await validasiJumlah(dosen, mahasiswa);

      // Menyimpan data nilai kriteria maksimal
      // dari data dosen yang memenuhi jumlah bimbingan
      const nilaiMax = await getMax(dosenByJumlah);

      // Proses Normalisasi
      const normalisasiDosen = await normalisasi(dosenByJumlah, nilaiMax, mahasiswa);

      // Proses Rangking Dosen
      const finalRangkingDosen = await perangkingan(normalisasiDosen);
      
      res.render('admin/mahasiswa/detail', {
        mahasiswa,
        rekomendasi: finalRangkingDosen,
        title: 'Detail Pengajuan Peoposal'
      })
      
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/mahasiswa')
    }
  },

  actionStatusAccepted: async (req, res) => {
    try {
      const { id } = req.params

      const mahasiswa = await Mahasiswa.findOne({_id : id}).populate({
        'path':'ajaran',
        'model':'Ajaran'
      })
     
      const dosen = await Dosen.find({status: "Y"})

      // Proses validasi filter jumlah bimbingan
      const dosenByJumlah = await validasiJumlah(dosen, mahasiswa);

      // Menyimpan data nilai kriteria maksimal
      // dari data dosen yang memenuhi jumlah bimbingan
      const nilaiMax = await getMax(dosenByJumlah);

      // Proses Normalisasi
      const normalisasiDosen = await normalisasi(dosenByJumlah, nilaiMax, mahasiswa);

      // Proses Rangking Dosen
      const finalRangkingDosen = await perangkingan(normalisasiDosen);

      await Mahasiswa.findOneAndUpdate({
        _id: id
      }, { status: 'accepted' , dosen: finalRangkingDosen[0].id })

      req.flash('alertMessage', "Berhasil menyetujui pengajuan skripsi")
      req.flash('alertStatus', "success")

      res.redirect('/mahasiswa')

    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/mahasiswa')
    }
  },

  apiActionCreate : async(req, res)=>{
    try {
      const { npm, nama, semester, email, no_wa, 
        judul_skripsi, tema_skripsi, file_proposal, file_rekap_nilai,
        mata_kuliah_lain, dosen_sebelum, ajaran, lanjutan } = req.body;

      dosen_sebelum = dosen_sebelum ? dosen_sebelum : '-';

      let mahasiswa = await Mahasiswa({ npm, nama, semester, email, no_wa, 
        judul_skripsi, tema_skripsi, file_proposal, file_rekap_nilai,
        mata_kuliah_lain, dosen_sebelum, ajaran, lanjutan })
      await mahasiswa.save();

      res.status(200).json({ message: 'ok', data: mahasiswa })

    } catch (err) {
      res.status(500).json({ message: err.message || `Internal server error` , data: undefined })
    }
  },
  
  apiUploadProposal: async (req, res) => {
    try {
      if(req.file){
        let tmp_path= req.file.path;
        let originaExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
        let name = req.file.originalname.split('.');
        let filename = req.file.filename + '_' +  name[0] + '.' + originaExt;
        let target_path = path.resolve(config.rootPath, `public/uploads/proposal/${filename}`)

        const src = fs.createReadStream(tmp_path)
        const dest = fs.createWriteStream(target_path)

        src.pipe(dest)

        src.on('end', async ()=>{
          try {
            res.status(200).json({ message: 'ok', data: {
              uri: filename
            } })
            
          } catch (err) {
            res.status(500).json({ message: err.message || `Internal server error` , data: undefined })
          }
        })
      } else {
        res.status(400).json({ message: `Request Payload Tidak Valid` , data: undefined })
      }

    } catch (err) {
      res.status(500).json({ message: err.message || `Internal server error` , data: undefined })
    }
  },

  apiUploadRekap: async (req, res) => {
    try {
      if(req.file){
        let tmp_path= req.file.path;
        let originaExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
        let name = req.file.originalname.split('.');
        let filename = req.file.filename + '_' +  name[0] + '.' + originaExt;
        let target_path = path.resolve(config.rootPath, `public/uploads/rekap/${filename}`)

        const src = fs.createReadStream(tmp_path)
        const dest = fs.createWriteStream(target_path)

        src.pipe(dest)

        src.on('end', async ()=>{
          try {
            res.status(200).json({ message: 'ok', data: {
              uri: filename
            } })
            
          } catch (err) {
            res.status(500).json({ message: err.message || `Internal server error` , data: undefined })
          }
        })
      } else {
        res.status(400).json({ message: `Request Payload Tidak Valid` , data: undefined })
      }

    } catch (err) {
      res.status(500).json({ message: err.message || `Internal server error` , data: undefined })
    }
  },
}