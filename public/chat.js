$(function() {

  var socket = io();

  $('#chatForm').submit(function(event) {
    event.preventDefault();
    var msg = $('#m').val();
    socket.emit('chat-message', msg);
    $('#m').val('');
  });

  socket.on('chat-message', function(message) {
    $('#messages').append("<li>" + message + "</li>");
  });

});
