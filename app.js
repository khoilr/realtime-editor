const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const socketio = require('socket.io')
const { createAdapter } = require('@socket.io/redis-adapter')
const { createClient } = require('redis')
const session = require('express-session')
const sharedSession = require('express-socket.io-session')
require('dotenv').config()

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// middleware
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// start ExpressJS server
const server = app.listen('3000', () => {
    console.log(`Server started on http://localhost:3000`)
})

// init socket.io
const io = socketio(server)

// init redis
// const pubClient = createClient(process.env.REDIS_URL)
const pubClient = createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
})
const subClient = pubClient.duplicate()

// connect to redis
pubClient
    .connect()
    .then(() => {
        console.log('Redis client connected')
    })
    .catch((err) => {
        console.log('Redis client connection error: ', err)
    })
subClient
    .connect()
    .then(() => {
        console.log('Redis client connected')
    })
    .catch((err) => {
        console.log('Redis client connection error: ', err)
    })

// catch redis error
pubClient.on('error', (err) => {
    console.log(err.message)
})
subClient.on('error', (err) => {
    console.log(err.message)
})

// Create Express session
const expressSession = session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
})

// Use Express session
io.use(sharedSession(expressSession))

// Use Redis adapter
io.adapter(createAdapter(pubClient, subClient))

// socket.io events
io.on('connection', (socket) => {
    const session = socket.handshake.session

    console.log('A user connected')

    socket.on('disconnect', () => {
        console.log('The user disconnected')
    })

    socket.on('join-editor', (editor) => {
        socket.join(editor)
        pubClient
            .get(editor)
            .then((reply) => {
                if (reply) {
                    const { room, user, value } = JSON.parse(reply)
                    console.log(room)
                    socket.emit('update-text', { room, user, value })
                }
            })
            .catch((err) => {
                console.log('err: ', err)
            })
    })

    socket.on('leave-editor', (editor) => {
        socket.leave(editor)
    })

    socket.on('text-change', (data) => {
        const { room, user, value } = data
        pubClient.set(room, JSON.stringify({ room, user, value }))
        socket.to(room).emit('update-text', { room, user, value })
    })
})

// Routes
const indexRouter = require('./routes/index')
const editorRouter = require('./routes/editor')
app.use('/', indexRouter)
app.use('/editor', editorRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})
