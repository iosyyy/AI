var app = require('http').createServer()
var io = require('socket.io')(app);

app.listen(8080);

io.on('connection', function (socket) {
  socket.emit('/base/train/', { hello: 'world' });
  socket.on('/base/train/', function (data) {
    console.log(data);
  });
});