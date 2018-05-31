//CLIENT
function updateUserData(names){
    $('#allUsers').empty();
    $('#active_users').text(Object.keys(names).length);
    for(var users in names){
        // $('#allUsers').append($('<li>').text(names[users].name));
        var usrLink = "<a href='/chat' target='_blank'>"+names[users].name+"</a>";
        $('#allUsers').append($('<li>').html(usrLink));
    }
}

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
        $('#messages').append($('<li>').text(msg));
    });

    socket.on('broadcast', function(msg) {
      $('#rmMsgs').append($('<li>').text(msg));
    });

    socket.on('disconnect', function(context){
        $('#rmMsgs').append($('<li>').text(context.msg));
        updateUserData(context.names);
    });
    
    socket.on('users online', function(names){
        updateUserData(names);
    });
});