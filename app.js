var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index');
});


io.on('connection', function(socket){

  socket.on('chat-message', function(message) {
    io.emit('chat-message', message);
  });

});


server.listen(3000, function(){
  console.log('listening on localhost:3000');
});
