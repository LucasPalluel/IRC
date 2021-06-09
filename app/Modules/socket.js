const socketio = require('socket.io')

module.exports = {
  initsocket: function(server){
    module.exports.io = socketio(server)
  },
  io:undefined
}
