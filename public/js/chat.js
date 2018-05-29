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
    
    $('#m').keypress(function(){
        socket.emit('typing', NICKNAME);
    });
    
    socket.on('typing', function(msg) {
        $('#feedback').text(msg);
    });

    socket.on('chat message', function(msg){
        $('#feedback').text('');        
        var $nameMsg = $('#nickname').text() + ' says: ';
        $('#messages').append($('<li>').text(msg));
    });

    socket.on('broadcast', function(msg) {
      $('#rmMsgs').append($('<li>').text(msg));
    });

    socket.on('disconnect', function(msg){
        $('#rmMsgs').append($('<li>').text(msg));
    });
});