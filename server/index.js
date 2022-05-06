var cors = require('cors');
var app = require('express')();
const fs = require('fs');

const options = {
    key: fs.readFileSync('../cert/key.pem'),
    cert: fs.readFileSync('../cert/cert.pem'),
    requestCert: true,
    rejectUnauthorized: false
  };


var https = require('https').createServer(options, app);


var io = require('socket.io')(https);

app.use(cors());

app.get('/view', (req, res) => {
    res.sendFile(__dirname + '/display.html');
})

io.on('connection', (socket)=> {

    socket.on("join-message", (roomId) => {
        console.log("join-message", roomId);
        socket.join(roomId);
        console.log("User joined in a room : " + roomId);
    })

    socket.on("screen-data", function(data) {
        data = JSON.parse(data);
        var room = data.room;
        var imgStr = data.image;
        socket.broadcast.to(room).emit('screen-data', imgStr);
    })
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
https.listen(server_port, () => {
    console.log("Started on : "+ server_port);
})