var express = require("express");
// import a module "express", making express a function
// require the library

var app = express();
// making express function a variable called app
// make the app

//on http
var server = require("http").createServer(app);

//Alternatively on localhost:8000
//var server = app.listen(8000);
//listen to port 8000

app.use(express.static("public"));
//let the app use static data such as html and js file in the 'public' dir
//so that when a user goes to the website, they see what's in the dir 'public'

var socket = require("socket.io");
// import  "socket.io", making socket a function
// import the library, which is like a function here now

var io = socket(server);

//for http
var port = process.env.PORT || 8081;

//for http
server.listen(port, function() {
  console.log("Server listening at port %d", port);
});
// for http: Routing
app.use(express.static("public"));

//deal with a new connection event
io.sockets.on("connection", newConnection);
//set up a customed event called connection,
//it will call function newConnect

function newConnection(socket) {
  //things that need to happen when there is a connection event

  console.log("My socket server is running. ");
  console.log("new connection!" + socket.id);
  //console.log(socket);

  socket.on("mouse", mouseMsg);
  //when event mouse happen, it will trigger function mouseMsg

  function mouseMsg(data) {
    socket.broadcast.emit("mouse", data);
    //broadcast the data to everyone in client except for sender itself

    //io.sockets.emit('mouse',data); -- send the data back to every client,
    // including the sender itself
    //console.log(data);
  }

  socket.on("othMouseClick", changeFill);

  function changeFill() {
    socket.broadcast.emit("othMouseClick");
  }
}

//to avoid "cannot get /"" error
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/index.html");
});
