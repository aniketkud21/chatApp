const express = require('express')
const app = require('express')()
const httpServer = require('http').createServer(app)
const User = require('./models/user')
const messageController = require('./controllers/messageController')

const passport = require('passport')

const io = require('socket.io')(httpServer)
//const app = express()

const cookieParser = require('cookie-parser')
const { Socket } = require('socket.io')

require('dotenv').config()

const port = process.env.PORT

app.use(express.static('./static'))
// app.get('/', (req,res)=>{
//     res.sendFile('./static/index.html');
// })

// -----------------SOCKET-------------------

const UsersMap = new Map()

io.on('connection', socket=>{
    
    console.log('socket connected')

    socket.on('new user',(userId)=>{
        console.log('in app,js')
        console.log(userId)
        User.findById(userId)
        .then((user)=>{
            console.log('in then');
            UsersMap.set(socket.id, user)
            console.log(UsersMap)
            socket.broadcast.emit('user joined', UsersMap.get(socket.id).username)
        })
        .catch((err)=>{
            console.log('in catch');
            console.log(err);
        })
    })

    socket.on('send',(message)=>{
        console.log(message)
        messageController.addMessage(message, UsersMap.get(socket.id)._id, UsersMap.get(socket.id).username)
        socket.broadcast.emit('receive', {message:message, name:UsersMap.get(socket.id).username})
    })
})

// ==============SOCKET=====================

require('./config/database');
require('./models/user');

require('./config/passport')(passport)
app.use(passport.initialize())

app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(require('./routes'))

// const wrapMiddlewareForSocketIo = middleware => (socket, next) => middleware(socket.request, {}, next);
// io.use(wrapMiddlewareForSocketIo(passport.initialize()));
// io.use(wrapMiddlewareForSocketIo(passport.authenticate(['jwt'])));



httpServer.listen(port, ()=>{
    console.log(`Server listening on ${port}`);
})


// app.listen(5000, ()=>{
//     console.log('Server listening on port '+port);
// })