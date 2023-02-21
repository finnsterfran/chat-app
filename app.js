const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const PORT = process.env.PORT || 9000;
const { Server } = require('socket.io');
const io = new Server(server);

let users = [];

// views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// static
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

// socket io connection
io.on('connection', (socket) => {
  socket.on('set user', (data, callback) => {
    if (users.indexOf(data) != -1) {
      callback(false);
    } else {
      callback(true);
      socket.username = data;
      users.push(socket.username);
      updateUsers();
    }
  });
  socket.on('send message', (data) => {
    io.sockets.emit('show message', { msg: data, user: socket.username });
  });

  socket.on('disconnect', (data) => {
    if (!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateUsers();
  });
  function updateUsers() {
    io.sockets.emit('users', users);
  }
});

server.listen(PORT, () => {
  console.log(`Nobara went shopping on Port ${PORT}`);
});
