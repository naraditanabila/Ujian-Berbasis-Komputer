const Express = require('express')
const bodyParser = require('body-parser')
const Pool = require('pg').Pool
require('dotenv').config()

const app = Express()
const port = 3000

const db = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: false
})

var adminRouter = require('./routes/admin')
var pesertaRouter = require('./routes/peserta')
var soalRouter = require('./routes/soal')
var ujianRouter = require('./routes/ujian')

db.connect()
app.use(bodyParser())

app.use(adminRouter)
app.use(pesertaRouter)
app.use(soalRouter)
app.use(ujianRouter)
app.listen(port, ()=>console.log('web service berhasil dijalankan'))