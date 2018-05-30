const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const body_parser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express.static('public'));
app.use(body_parser.urlencoded({extended: false}));

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});

var nicknames = {};

app.get('/', function(req, resp){
    resp.render('index.html', {});
});

app.get('/chat', function(req, resp){
    context = {
        nickname: req.query.nickname,
        room: req.query.chatroom
    };
    resp.render('chat.html', context);
});

function findMyUser(UserId){
    for (var ids in nicknames) {
        if (ids === UserId){
            return nicknames[ids].name;
        }
    }
    return 'not found';
}

io.on('connection', function(client){
    
    client.on('data', function(data){
        nicknames[client.id] = {name: data};
        client.broadcast.emit('broadcast', `${data} has joined the chat`);
        io.emit('users online', nicknames);
    });
    
    client.on('typing', function(name) {
        client.broadcast.emit('typing', `${name} is typing...`);
    });

    client.on('disconnect', function() {
        var user = findMyUser(client.id);
        var msg = `${user} has disconnected`;
        delete nicknames[client.id];
        io.emit('disconnect', msg);
    });

    //server side socket -> server EventEmitter
    client.on('chat message', function(msg){
        var UsrMsg = nicknames[client.id].name +": " + msg;
        io.emit('chat message', UsrMsg);
    });
});

http.listen(8080, function () {
  console.log('Listening on port 8000');
});
