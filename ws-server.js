const Broadcaster = require('./libcamera-broadcaster');
new Broadcaster({width: 640, height: 480, framerate: 20, port: 8080});
