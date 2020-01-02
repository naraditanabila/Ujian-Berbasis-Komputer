const express = require('express')
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

//uploadJadwal (POST)
app.post('/:id_admin/schedule/:id_jadwal',async(req,res) => {
    try {
        const id_admin = req.params.id_admin
        const id_jadwal = req.params.id_jadwal
        const {id_calonmhs, hari, tanggal, sesi, tempat, status} = req.body
        await dbPromise.query(`insert into jadwal(id_jadwal, id_calonmhs, hari, tanggal, tempat, sesi, id_admin, status)
            values('${id_jadwal}','${id_calonmhs}','${hari}','${tanggal}','${tempat}','${sesi}','${id_admin}','${status}')`)
        console.log(req.body)
        res.json('Jadwal baru berhasil diupload')
    } catch (error) {
        console.log(error)
        res.json('error')
    }
})

//updateJadwal (PUT)
app.put('/:id_admin/schedule/:id_jadwal',async(req,res) => {
    const {id_calonmhs} = req.body
    const {status} = req.body
    const {tempat} = req.body

    const id_admin = req.params.id_admin
    const id_jadwal = req.params.id_jadwal
    
    await dbPromise.query(`update jadwal set id_calonmhs = '${id_calonmhs}', status = '${status}', tempat ='${tempat}'
        where id_admin = '${id_admin} and id_jadwal '${id_jadwal}`)
    res.json('jadwal berhasil diubah')
})


//paketToUjian (POST)
app.post('/ujian/paket', async(req, res) => {
    try {
        const {id_paket_soal, id_calonmhs, id_jawaban} = req.body
        await dbPromise.query(`insert into jawaban(id_paket_soal, id_calonmhs, id_jawaban)
            values('${id_paket_soal}','${id_calonmhs}','${id_jawaban}')`)
        console.log(req.body)
        res.json('Paket soal berhasil dimasukkan ke dalam ujian peserta')
    } catch (error) {
        console.log(error)
        res.json('error')
    }
})


//displayAllJawaban (GET)
app.get('/ujian/answer/:id_ujian', async(req,res) => {
    let ret;
    const id_ujian = req.params.id_ujian
    dbPromise.query('SELECT distinct id_jawaban, jwbn FROM jawaban, calon_mahasiswa, ujian where ujian.id_ujian=$1 and ujian.id_calonmhs = jawaban.id_calonmhs',[id_ujian], (err,result) => {
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

//displayAllJadwal (GET)
app.get('/ujian/schedule',async(req, res) =>{
    let ret;
    dbPromise.query('SELECT * FROM jadwal', (err,result) => {
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
