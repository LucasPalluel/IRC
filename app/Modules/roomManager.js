module.exports = {
  rooms: {},
  getUserRooms:function(socket) {
    return Object.entries(module.exports.rooms).reduce((names, [name, room]) => {
      if (room.users[socket.id] != null) names.push(name)
      return names
    }, [])
  }
}
