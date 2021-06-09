const socketModule = require('./socket')
const insertbdd = require('./insertbdd')
const { rooms, getUserRooms } = require('./roomManager')
var connectedUsers = {};
socketModule.io.on('connection', socket => {
  socket.on('new-user', async (room, name) => {
    await insertbdd.DataBaseInsertUsers(name, room)
    socket.join(room)
    rooms[room].users[socket.id] = name
    socket.to(room).broadcast.emit('user-connected', name)
    connectedUsers[name] = socket;
  })
  socket.on('send-chat-message', async (room, message) => {
    await insertbdd.DataBaseInsertMsg(rooms[room].users[socket.id], message, room)
    socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
  })
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(async room => {
      await insertbdd.DataBaseRemoveUsers(rooms[room].users[socket.id])
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
      delete rooms[room].users[socket.id]
    })
  })
  socket.on('user-list', async (room) => {
    let users = await insertbdd.DataBaseFindUsers(room)
    socket.emit('user-listed', users)
  })
  socket.on('create-channel', async data => {
    const channel_name = data.channel_name;
    await insertbdd.DataBaseInsertChannels(channel_name)
    rooms[channel_name] = { users: {} }

  })
  socket.on('delete-channel', async data => {
    const channel_name = data.channel_name;
    await insertbdd.DataBaseRemoveChannels(channel_name)
    socket.emit('channel-deleted', channel_name)
  })
  socket.on('restore-message', async (room, callback) => {
    let msg = await insertbdd.DataBaseFindMessages(room)
    callback(msg)
  })
  /*Private chat*/
  socket.on('private_chat', data => {
    const to = data.to;
    const message = data.message;
    if (connectedUsers[to] !== undefined) {
      connectedUsers[to].emit('private_chat', {
        //The sender's username
        username: data.from,
        //Message sent to receiver
        message: message
      });
    }
    else {
      socket.emit('chat-message', { name: 'error', message: 'Error command' })
    }
  });
})