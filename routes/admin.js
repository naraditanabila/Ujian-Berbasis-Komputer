const express = require('express')
const mongoose = require('mongoose')
const app = express()

const Pool = require('pg').Pool
require('dotenv').config()

//var md5 = require('md5')

const dbPromise = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: false
})

//var passwordHash = require('password-hash')


//loginAdmin (POST)
/*app.post('/login/admin', (req, res) => {
    var jwt = require('jsonwebtoken')
    var Schema = mongoose.Schema
    var adminschema = new Schema({
        username: String,
        password: String
    });
    var adminModel = mongoose.model('administrator',adminschema)
    var obj = req.body
    adminModel.find(obj, (err, docs) => {
        if (err) {
            res.send(err)
        }
        else {
            if (docs && docs.length > 0) {
                var token = jwt.sign({ username: docs[0].username }, 'secret', { expiresIn: '24h' })
                res.json({ success: true, msg: 'successfully login', token: token })
            }
            else {
                res.send('Invalid username or password')
            }
        }
    })
})*/

//addSoal (POST)
app.post('/:id_admin/soal/:id_soal',async(req,res) => {
    try {
        const id_admin = req.params.id_admin
        const id_soal = req.params.id_soal
        const {pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, opsi_e, kunci_jwbn, kategori_soal} = req.body
        await dbPromise.query(`insert into soal(id_soal,pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, opsi_e, kunci_jwbn, kategori_soal, id_admin)
            values('${id_soal}','${pertanyaan}','${opsi_a}','${opsi_b}','${opsi_c}','${opsi_d}','${opsi_e}','${kunci_jwbn}','${kategori_soal}','${id_admin}')`)
        console.log(req.body)
        res.json('Soal berhasil ditambahkan')
    } catch (error) {
        console.log(error)
        res.json('error')
    }
})

//updateSoal (PUT)
app.put('/:id_admin/soal/:id_soal',async(req,res)=>{
    const {pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, opsi_e, kunci_jwbn, kategori_soal} = req.body
    const id_admin = req.params.id_admin
    const id_soal = req.params.id_soal
    
    await dbPromise.query(`update soal set pertanyaan = '${pertanyaan}', opsi_a = '${opsi_a}', 
                                    opsi_b = '${opsi_b}', opsi_c = '${opsi_c}', 
                                    opsi_d = '${opsi_d}', opsi_e = '${opsi_e}', 
                                    kunci_jwbn = '${kunci_jwbn}', kategori_soal = '${kategori_soal}'
                                    where id_soal = '${id_soal}'`)
    console.log(req.body)
    res.json('data berhasil diubah')
})

//addPaket (POST)
app.post('/:id_admin/paket/add',async(req,res) => {
    const id_admin = req.params.id_admin
    try {
        const {id_paket, nama_paket, kategori_paket} = req.body
        await dbPromise.query(`insert into paket(id_paket, nama_paket, kategori_paket)
            values('${id_paket}', '${nama_paket}','${kategori_paket}')`)
        console.log(req.body)
        res.json('Paket baru berhasil ditambahkan')
    } catch (error) {
        console.log(error)
        res.json('error')
    }
})

//fillPaket (POST)
app.post('/:id_admin/paket/fill',async(req,res) => {
    const id_admin = req.params.id_admin
    try {
        const {id_paket, id_soal, id_paket_soal} = req.body
        await dbPromise.query(`insert into paket_soal(id_paket, id_soal, id_paket_soal)
            values('${id_paket}','${id_soal}','${id_paket_soal}')`)
        console.log(req.body)
        res.json('Soal berhasil ditambahkan ke dalam paket')
    } catch (error) {
        console.log(error)
        res.json('error')
    }
})

//uploadNilai (PUT)
app.put('/:id_admin/nilai/:id_ujian',async(req,res)=>{
    const {nilai} = req.body
    const id_admin = req.params.id_admin
    const id_ujian = req.params.id_ujian
    
    await dbPromise.query(`update ujian set nilai = '${nilai}' where id_ujian = '${id_ujian}'`)
    console.log(req.body)
    res.json('Nilai berhasil diupload.')
})


module.exports = app;
