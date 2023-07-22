const http    = require('http');
const express = require('express');

const Broadcaster = require('./libcamera-broadcaster');

const app = express();
app.use(express.static(__dirname + '/site'));
const httpServer = http.createServer(app);
httpServer.listen(2050);

console.log("Creating new broadcaster");
new Broadcaster({width: 640, height: 480, framerate: 20, hdr: 1, port:8080});
