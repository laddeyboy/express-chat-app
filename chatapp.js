const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express.static('public'));

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});


app.get('/', function(req, resp){
    resp.render('chat.html', {});
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

http.listen(8080, function () {
  console.log('Listening on port 8000');
});
