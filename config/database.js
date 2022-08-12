const mongoose = require('mongoose')

require('dotenv').config()

const DB_url = process.env.DB_URL

const connection = mongoose.connect(DB_url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', ()=>{
    console.log('Database connected');
})

