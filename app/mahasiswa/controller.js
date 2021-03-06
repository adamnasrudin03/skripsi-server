const Mahasiswa = require('./model')
const Ajaran = require('./../ajaran/model')
const Dosen = require('./../dosen/model')
const Pesan = require('./../pesan/model')
const nilai = require('./../dosen/nilai');
const path = require('path')
const fs = require('fs')
const config = require('../../config');
const { validateEmail } = require('../../helpers');

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
    bidangAplikasiWeb: maxAppWeb,
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
    c1.nilai = parseFloat(c1.nilai).toFixed(3)

    // Normalisasi kriteria fungsional
    let c2 = {
      nilai: dataDosen[j].fungsional / nilaiMax.fungsional
    }

    c2.nilai = parseFloat(c2.nilai).toFixed(3)
    // Normalisasi kriteria Kompetensi / tema
    let c3 = {
      nilai: 0
    }

    switch (mahasiswa.tema_skripsi) {
      case 'bidang_aplikasi_desktop':
        c3.nilai =  dataDosen[j].bidang_aplikasi_desktop / nilaiMax.bidangAplikasiDesktop;
        break;
    
      case 'bidang_aplikasi_web':
        c3.nilai =  dataDosen[j].bidang_aplikasi_web / nilaiMax.bidangAplikasiWeb;
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

    c3.nilai = parseFloat(c3.nilai).toFixed(3)
    // Normalisasi kriteria jumlah
    let c4 = {
      nilai: dataDosen[j].jumlah / nilaiMax.jumlah
    }
    c4.nilai = parseFloat(c4.nilai).toFixed(3)

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
    let b = (nilaiKriteria.c3 * normalisasiDosen[k].c3.nilai) + (nilaiKriteria.c4 * normalisasiDosen[k].c4.nilai);

    let v = {
      nilai: a + b
    };

    let perangkingan = {
      id: normalisasiDosen[k].id,
      nidn: normalisasiDosen[k].nidn,
      nama: normalisasiDosen[k].nama,
      gelar: normalisasiDosen[k].gelar,
      nilai: parseFloat(v.nilai).toFixed(3)
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

function getLinkWhastapp(number, message) {
  return 'https://wa.me/' + number + '?text=%20' + encodeURIComponent(message)
}

module.exports={
  index: async(req, res)=>{
    try {
      let ajaranID = req.query.ajaran_id;
      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")
      
      const ajaran = await Ajaran.find().sort({ _id: -1 })

      const alert = { message: alertMessage, status: alertStatus}
      const mahasiswa = await Mahasiswa.find( ajaranID&&ajaranID !=="all" ? { ajaran: ajaranID} : {} ).sort({ _id: -1 })
        .populate({
          'path':'ajaran',
          'model':'Ajaran'
        })
        .populate({
          'path':'dosen',
          'model':'Dosen'
        })
        .populate({
          'path':'dosen2',
          'model':'Dosen'
        })

      res.render('admin/mahasiswa/view_mahasiswa',{
        mahasiswa,
        ajaran,
        alert,
        admin: req.session.user,
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
        .populate({
          'path':'dosen2',
          'model':'Dosen'
        })
        .populate({
          'path':'pesan',
          'model':'Pesan'
        })

      const dosen = await Dosen.find({status: "Y"}).sort({ nama: 1 });
      const dosen2 = dosen;
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
        dosenID: mahasiswa.dosen?._id.toString() || '',
        dosen2ID: mahasiswa.dosen2?._id.toString() || '',
        rekomendasi: finalRangkingDosen,
        dosen2,
        admin: req.session.user,
        title: 'Detail Pengajuan Proposal'
      })
      
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/mahasiswa')
    }
  },

  actionUpdateDosen: async (req, res) => {
    try {
      const { id } = req.params
      const { dosen_id, dosen2_id } = req.body
      
      await Mahasiswa.findOneAndUpdate({
        _id: id
      }, { dosen: dosen_id, dosen2: dosen2_id })

      req.flash('alertMessage', "Berhasil ubah dosen pembimbing skripsi")
      req.flash('alertStatus', "success")

      res.redirect('/mahasiswa')


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

  viewPesan : async(req, res)=>{
    try {
      const { id } = req.params
      
      const mahasiswa = await Mahasiswa.findOne({_id : id})
        .populate({
          'path':'pesan',
          'model':'Pesan'
        })

      res.render('admin/mahasiswa/edit_pesan', {
        mahasiswa,
        admin: req.session.user,
        title: 'Tambah Pesan'
      })
      
    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/mahasiswa')
    }
  },

  actionCreatePesan: async (req, res) => {
    try {
      const { id } = req.params
      const { text_message } = req.body
      const mahasiswa = await Mahasiswa.findOne({ _id : id})

      // Generate link  whatsapp
      const link = getLinkWhastapp(mahasiswa.no_wa, text_message)
      
      // Save data pesan in db
      const resPesan = await Pesan({ text: text_message, link })
      await resPesan.save();

      // Update data mahasiswa (field pesan from resPesan)
      await Mahasiswa.findOneAndUpdate({
        _id: id
      }, { pesan: resPesan._id })

      req.flash('alertMessage', "Berhasil tambah data pesan whatsapp")
      req.flash('alertStatus', "success")

      res.redirect(`/mahasiswa`)


    } catch (err) {
      req.flash('alertMessage', `${err.message}`)
      req.flash('alertStatus', 'danger')
      res.redirect('/mahasiswa')
    }
  },

  apiActionCreate : async(req, res)=>{
    try {
      let { npm, nama, semester, email, no_wa, 
        judul_skripsi, tema_skripsi, file_proposal, file_rekap_nilai,
        mata_kuliah_lain, dosen_sebelum, dosen_sebelum2, ajaran, lanjutan } = req.body;

      dosen_sebelum = dosen_sebelum ? dosen_sebelum : '-';
      dosen_sebelum2 = dosen_sebelum2 ? dosen_sebelum2 : '-';

      if(!validateEmail(email)) {
        res.status(400).json({ message: `Format email yang anda masukan tidak sesuai.` , data: undefined });
        return;
      }

      //check phone input [first chart input 62 or 0]
      if(no_wa.charAt(0) === "6" && no_wa.charAt(1) === "2") {
        no_wa = "62" + no_wa.substr(2, no_wa.length);
      } else if(no_wa.charAt(0) === "0") {
        no_wa = "62" + no_wa.substr(1, no_wa.length);
      } else if(no_wa === "") {
        no_wa = no_wa;
      } else {
        no_wa = "62" + no_wa;
      }

      const checkAjaran = await Ajaran.findOne({ _id : ajaran})
      if (!checkAjaran) {
        res.status(404).json({ message: `Tahun ajaran tidak ditemukan.` , data: undefined });
        return;
      }

      let mahasiswa = await Mahasiswa({ npm, nama, semester, email, no_wa, 
        judul_skripsi, tema_skripsi, file_proposal, file_rekap_nilai,
        mata_kuliah_lain, dosen_sebelum, dosen_sebelum2, ajaran, lanjutan })
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