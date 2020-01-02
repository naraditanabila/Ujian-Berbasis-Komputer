const express = require('express')
const mongoose = require('mongoose')
const app = express()

const Pool = require('pg').Pool
require('dotenv').config()

const dbPromise = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: false
})

//var passwordHash = require('password-hash')

function getOne(id) {
    return dbPromise('calon_mahasiswa').where('id_calonmhs', id).first();
}

//loginUser (POST)
app.post('/login/user', async(req, res) => {
    var jwt = require('jsonwebtoken')
    var Schema = mongoose.Schema
    var userschema = new Schema({
        id_calonmhs: String,
        password: String
    })
    var userModel = mongoose.model('calon_mahasiswa',userschema)
    .getOne(req.body.id_calonmhs)
    .then(user => {
        console.log('calon_mahasiswa', calon_mahasiswa)
        res.json({
            calon_mahasiswa
        })
    })
    /*var obj = req.body
    userModel.find(obj, (err, docs) => {
        if (err) {
            res.send(err)
        }
        else {
            if (docs && docs.length > 0) {
                var token = jwt.sign({ id_calonmhs: docs[0].username }, 'secret', { expiresIn: '24h' })
                res.json({ success: true, msg: 'successfully login', token: token })
            }
            else {
                res.send('Invalid id number or password')
            }
        }
    })*/
})

//displayJadwal (GET)
app.get('/:id_calonmhs/jadwal', async(req,res) => {
    let ret;
    const id_calonmhs = req.params.id_calonmhs
    dbPromise.query('SELECT * FROM jadwal where id_calonmhs=$1', [id_calonmhs], (err, result) => {
        if (!err){
            ret={
                status:200,
                result: result.rows
            };
            res.status(200).json(ret)
        }
        else {
            ret={
                status:err.code,
                result: err.message
            };
            res.json(ret)
        }
    })
})


//uploadJawaban (PUT)
app.put('/:id_calonmhs/jawaban/:id_paket_soal', async(req,res) => {
    const {jwbn} = req.body
    const id_paket_soal = req.params.id_paket_soal
    const id_calonmhs = req.params.id_calonmhs

    await dbPromise.query(`Update jawaban set jwbn = '${jwbn}' where id_paket_soal = '${id_paket_soal}' and id_calonmhs = '${id_calonmhs}'`)
    console.log(req.body)
    res.json('Jawaban dari ujian peserta berhasil ditampilkan')
})

//displaySoal (GET)
app.get('/:id_calonmhs/soal/:id_paket', async(req, res) => {
    let ret;
    const id_calonmhs = req.params.id_calonmhs;
    const id_paket = req.params.id_paket;
    dbPromise.query('SELECT distinct soal.id_soal, soal.pertanyaan, soal.opsi_a, soal.opsi_b, soal.opsi_c, soal.opsi_d, soal.opsi_e FROM soal, paket, paket_soal, ujian WHERE ujian.id_paket=$1 and paket_soal.id_paket = ujian.id_paket and paket_soal.id_paket=paket.id_paket and paket_soal.id_soal = soal.id_soal',[id_paket], (err, result) => {
        if (!err){
            ret={
                status:200,
                result: result.rows
            };
            res.status(200).json(ret)
        }
        else {
            ret={
                status:err.code,
                result: err.message
            };
            res.json(ret)
        }
    })
})

//displayNilai (GET)
app.get('/:id_calonmhs/nilai', async(req,res) => {
    let ret;
    const id_calonmhs = req.params.id_calonmhs
    dbPromise.query('SELECT id_ujian, nilai FROM ujian where id_calonmhs=$1', [id_calonmhs], (err,result) => {
        if (!err){
            ret={
                status:200,
                result: result.rows
            };
            res.status(200).json(ret)
        }
        else {
            ret={
                status:err.code,
                result: err.message
            };
            res.json(ret)
        }
    })
})

//displayJawaban (GET)
app.get('/:id_calonmhs/jawaban/:id_paket', async(req,res) => {
    let ret;
    const id_calonmhs = req.params.id_calonmhs
    const id_paket = req.params.id_paket
    dbPromise.query('SELECT distinct id_jawaban, jwbn FROM jawaban, paket_soal where jawaban.id_calonmhs =$1 and paket_soal.id_paket = $2 and paket_soal.id_paket_soal=jawaban.id_paket_soal', [id_calonmhs, id_paket], (err, result) => {
        if (!err){
            ret={
                status:200,
                result: result.rows
            };
            res.status(200).json(ret)
        }
        else {
            ret={
                status:err.code,
                result: err.message
            };
            res.json(ret)
        }
    })
})

module.exports = app;
