
const socket = io('http://localhost:8000')
const messageContainer = document.getElementById('message-container')
const liste = document.getElementById('liste')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
var name = "";
var newName = "";
var connectedUsers = {};
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

if (messageForm != null) {
  name = prompt('What is your name?')
  if (name == "" || name == "null") {
    name = "Guest" + getRandomInt(9999)
  }
  socket.emit('new-user', roomName, name)
  socket.emit('restore-message', roomName, messages => {
    for (const message of messages) {
      appendMessage(`${message.nickname} : ${message.message}`)
    }
    appendMessage('You joined as ' + name)
  })

  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    const command = message.split(' ')

    if (command[0] == "/msg") {
      var username = command[1]
      var send_message = message.substring(message.indexOf(' ') + 2)
      socket.emit('private_chat',{to : username, message : send_message, from : name});
      appendMessage(`(Private) To ${username} : ${send_message}`);
      messageInput.value = ''
    }
    else if (command[0] == "/nick") {
      appendMessage(`You did the nick command your name was ${name}`)
      if (command[1] == "" || command[1] === null) {
        name = "Guest" + getRandomInt(9999)
      }
      else {
        name = command[1];
      }
      socket.emit('new-user', roomName, name)
      appendMessage(`And has been change to ${name}`)
      messageInput.value = ''
    }
    else if (command[0] == "/list") {
      $.get('/channels').then(data => {
        appendMessage(`Channels : ${data.channels.join(", ")}`)
      })
      messageInput.value = ''
    }
    else if (command[0] == "/create") {
      var channel_name = command[1]
      socket.emit('create-channel', { channel_name: channel_name })
      appendMessage(`Channel ${channel_name} is created`)
      messageInput.value = ''
    }
    else if (command[0] == "/delete") {
      var channel_name = command[1]
      socket.emit('delete-channel', { channel_name: channel_name })
      appendMessage(`Channel deleted`)
      messageInput.value = ''
    }
    else if (command[0] == "/join") {
      window.location.replace("/" + command[1]);
      messageInput.value = ''
    }
    else if (command[0] == "/quit") {
      window.location.replace("/index");
      messageInput.value = ''
    }
    else if (command[0] == "/users") {
      window.scrollTo(0, document.body.scrollHeight);
      socket.emit('user-list', roomName)
      messageInput.value = ''
    }
    else {
      appendMessage(`You: ${message}`)
      window.scrollTo(0, document.body.scrollHeight);
      socket.emit('send-chat-message', roomName, message)
      messageInput.value = ''
    }
  })
}

socket.on('room-created', room => {
  const roomElement = document.createElement('div')
  roomElement.innerText = room
  const roomLink = document.createElement('a')
  const br = document.createElement('br')
  const saut = document.createElement('br')
  roomLink.href = `/${room}`
  roomLink.innerText = 'Join ' + room
  roomLink.style.textDecoration = "none"
  roomLink.style.color = "#1E90FF"
  roomContainer.append(roomLink)
  roomContainer.append(br)
  roomContainer.append(saut)
})

socket.on('channel deleted', room => {
  var ele = document.getElementsByName('Join ' + room);
  for (var i = ele.length - 1; i >= 0; i--)
    ele[i].parentNode.removeChild(ele[i]);
})

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

socket.on('user-listed', users => {
  appendMessage(`Users : ${users.map(user => " " + user.nickname)}`)
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}


/*Received private messages*/
socket.on('private_chat', data => {
  var username = data.username;
  var message = data.message;
  appendMessage(`(Private) From ${username} : ${message}`);
});
