# libcamera-broadcaster

Heavily based on raspivid-broadcaster by Richardn2002, but converted to use more recent libcamera libraries instead of raspicam ones

# raspivid-broadcaster

Using @131 's [h264-live-player](https://github.com/131/h264-live-player) but struggling with multiple watchers? Here I present a simple server to solve that for you.

# Motivation
@131 has done an amazing job packaging [Broadway.js](https://github.com/mbebenita/Broadway) with websocket, however the server-side codes that comes with the client are messy and can not handle multiple clients or late loggers. So I wrote a server for Raspberry Pi that can broadcast h.264 streams from a Raspberry camera to clients better. I am using my codes in an engineering contest where low-latency video streams to multiple users are required, and I hope this repo can also help your projects. See this [issue](https://github.com/131/h264-live-player/issues/88) for more info on how these codes come together.

# Brief Explanation

The major reason why clients other than the first can not view streams is that the client must receive a few 'headers' to prepare itself and start displaying videos, which latecomers will be missing if the server just mindlessly streams whatever comes out of raspivid. The headers consist of three parts:
1. An object related to @131 's websocket client packaging.
See [line 4496 of the client](https://github.com/131/h264-live-player/blob/master/vendor/dist/http-live-player.js). The client has to first receive an object to start working:
`{action: "init", width: width, height: height}`
2. Data related to h.264 encoding.
The client has to receive Sequence Parameter Set (SPS) and Picture Parameter Set (PPS) before actual video frames to know how to decode the video stream. SPS and PPS are given as soon as raspivid starts, so I capture and store them and deliver them to new clients. See [here](https://www.cardinalpeak.com/blog/the-h-264-sequence-parameter-set) for more info.
3. An IDR frame.
An IDR frame specifies that no frame after the IDR frame can reference any frame before it. In short, it refreshes the client with the complete visual info of a moment. I keep track of the latest IDR frame and deliver it to new clients so that they will be watching from the latest moment.

# Installation/Demo
```
git clone https://github.com/Squeack/libcamera-broadcaster.git
cd libcamera-broadcaster
npm install
node ws+http-server.js  # Then simply browse to http://<address-of-your-pi>:2050/camera.html
```

# Usage

I suggest
```
node ws-server.js
```
to spin up only the websocket server for video stream. Serve the client webpage in your own ways like using nginx or Apache.

And look into `ws-server.js` to find out how to embed `raspivid-broadcaster.js` into your projects and change streaming configurations.

# Credits

`site/http-live-player.js` is solely @131 's work.

@pimterry 's [raspivid-stream](https://github.com/pimterry/raspivid-stream) is heavily referenced.
