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

//displayAllSoal (GET)
app.get('/ujian/soal',async(req, res) =>{
    let ret;
    dbPromise.query('SELECT * FROM soal', (err, result) => {
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

//displayAllPaket (GET)
app.get('/ujian/paket',async(req, res) =>{
    let ret;
    dbPromise.query('SELECT * FROM paket', (err, result) => {
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

//displayAllNilai (GET)
app.get('/nilai',async(req, res) =>{
    let ret;
    dbPromise.query('SELECT * FROM ujian', (err, result) => {
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

//displayPaketSoal (GET)
app.get('/ujian/soal/:id_paket',async(req, res) =>{
    let ret;
    const id_paket = req.params.id_paket;
    dbPromise.query('SELECT distinct * FROM soal, paket, paket_soal, ujian WHERE ujian.id_paket=$1 and paket_soal.id_paket = ujian.id_paket and paket_soal.id_paket=paket.id_paket and paket_soal.id_soal = soal.id_soal',[id_paket], (err, result) => {
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
