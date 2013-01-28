var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs'),
    uuid = require('node-uuid');

app.listen(8000);

var handler = function(req, res) {
  fs.readFile(__dirname + '/index.html',
    function(err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error');
      }

      res.writeHead(200);
      res.end(data);
    });
};

io.sockets.on('connection', function(socket) {
  var nodeId = uuid.v4();
  socket.join(nodeId);

  socket.on('candidate', function (data) {
    // Notify all nodes about new candidates.
    socket.broadcast.emit('candidate', {
      'from': nodeId,
      'candidate': data.candidate
    });
  }

  socket.on('offer', function (data) {
    io.sockets.in(data.to).emit('offer', {
      'from': nodeId,
      'desc': data.desc
    });
  });

  socket.on('answer', function (data) {
    io.sockets.in(data.to).emit('answer', {
      'from': nodeId,
      'desc': data.desc
    });
  });
});
