const pendidikan = {
    s2: 0.5,
    s3: 1,
}

const fungsional = {
    tenagaPengajar: 0.25,
    asistenAhli: 0.50,
    lektor: 0.75,
    lektorKepala: 1,
}

const bidang = {
    tingkat8: 0.125,
    tingkat7: 0.25,
    tingkat6: 0.375,
    tingkat5: 0.50,
    tingkat4: 0.625,
    tingkat3: 0.75,
    tingkat2: 0.875,
    tingkat1: 1,
}

const jumlah = {
    sangatBanyak: 0,
    banyak: 0.25,
    cukup: 0.50,
    kurang: 0.75,
    sangatKurang: 1,
}

module.exports = {
    pendidikan,
    fungsional,
    bidang,
    jumlah
}