
/* var fs=require('fs');
var data =fs.readFileSync('text.txt');
console.log(data.toString());
console.log('end here'); */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);





app.get('/', function (req, res) {
   res.sendfile('index.html');
});
var internetAvailable = require("internet-available");

internetAvailable().then(function () {
   console.log("Internet available");
}).catch(function () {
   console.log("No internet");
});




var users = [];
var left=[];

io.on('connection', (socket) => {

   console.log('user connected' + ':' + socket.id);

   socket.emit('msghead', 'welcome to our chat room');

  

   socket.on('new-user-join', name => {

      socket.emit('message', 'welcome' + ':' + name);
      socket.emit('heading', 'welcome' + ':' + name);
     io.emit('auser',  name);

      console.log(name + ':' + 'connected');
     

      users[name]=socket.id;
      left[socket.id]=name;

      io.emit('user-join', name);

   });

   socket.on('chatm',data => {
      var socketid=users[data.receiver];

       io.to(socketid).emit('pmsg',  data);
    
      

   });
   socket.on('chatp',data => {
socket.broadcast.emit('pumsg',data);

   });

   socket.on('disconnect', message => {
     socket.broadcast.emit('left',left[socket.id]);
     socket.broadcast.emit('leftli', left[socket.id]);
    
    
    
      console.log(left[socket.id] +':' +  'disconnected');
      delete left[socket.id];
    });
  

  

});





var port=process.env.PORT || 3000 

 http.listen(port, () => {
   console.log('listening on :' + port);
})
 