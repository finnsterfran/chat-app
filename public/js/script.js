$(document).ready(() => {
  let messages = [];
  let socket = io.connect();
  let chatForm = $('#chatForm');
  let message = $('#chatInput');
  let chatWindow = $('#chatWindow');
  let userForm = $('#userForm');
  let username = $('#username');
  let users = $('#users');
  let error = $('#errors');

  // submit user form
  userForm.on('submit', (e) => {
    e.preventDefault();
    socket.emit('set user', username.val(), (data) => {
      if (data) {
        $('#userFormWrap').hide();
        $('#mainWrap').show();
      } else {
        error.html('User name is taken');
      }
    });
  });

  // submit chatform / message
  chatForm.on('submit', (e) => {
    socket.emit('send message', message.val());
    message.val('');
    e.preventDefault();
  });

  socket.on('show message', (data) => {
    chatWindow.append(
      '<strong>' + data.user + '</strong>' + data.msg + '<br><br>',
    );
  });

  // display user name
  socket.on('users', (data) => {
    let html = '';
    data.forEach((user) => {
      html += '<li class="list-group-item">' + user + '</li>';
    });
    users.html(html);
  });
});
