//CLIENT


$(document).ready(function () {
    //client side socket -> client EventEmitter
    var socket = io();

    socket.on('connect', function(){
       socket.emit('data', NICKNAME);
       return false;
    });

    $('form').submit(function(){
        //this line is just sending our message from 'form' back to server
        socket.emit('chat message', $('#m').val());
        //next line clears the text box for next message.
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg){
        var $nameMsg = $('#nickname').text() + ' says: ';
        console.log($nameMsg);
        $('#messages').append($('<li>').text(msg));
    });

    socket.on('broadcast', function(msg) {
      $('#rmMsgs').append($('<li>').text(msg));
    });

    socket.on('disconnect', function(msg){
        console.log($('#nickname').val());
        $('#rmMsgs').append($('<li>').text(msg));
    });

});