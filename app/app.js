var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var mongoClient = require('mongodb').MongoClient;
const socket = require('./Modules/socket')
const { rooms, getUserRooms } = require('./Modules/roomManager')
const port = 8000;
const insertbdd = require('./Modules/insertbdd')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const socketio = require('./Modules/socket')
socketio.initsocket(server)
const socketManager = require('./Modules/socketManager')
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

insertbdd.DataBaseRemoveOldUsers().then().catch(error => {})
insertbdd.DataBaseFindChannels().then(channels => {
  for (const channel of channels)
    rooms[channel.channel] = { users: {} }
}).catch(error => console.error(error))



app.use('/lib/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

app.get('/channels', (req, res) => {
  insertbdd.DataBaseFindChannels().then(channels => {
    res.json({ channels: channels.map(channel => channel.channel) })
  })
})

app.get('/', (req, res) => {
  res.render('index', { rooms: rooms })
})

app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/')
  }
  rooms[req.body.room] = { users: {} }
  res.redirect(req.body.room)
  // Send message that new room was created

  insertbdd.DataBaseInsertChannels(req.body.room)
  socketio.io.emit('room-created', req.body.room)
})

app.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/')
  }
  res.render('room', { roomName: req.params.room })
})

server.listen(8000)
