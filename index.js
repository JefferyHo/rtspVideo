const express = require("express");
const expressWebSocket = require("express-ws");
const ffmpeg = require("fluent-ffmpeg");
const webSocketStream = require("websocket-stream/stream");
// const WebSocket = require("websocket-stream");

function localServer() {
    let app = express();
    app.all('*', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
      next();
    });

    app.use(express.static(__dirname));
    expressWebSocket(app, null, {
        perMessageDeflate: true
    });
    app.get("/", function(req, res, next){
      res.setHeader('Content-Type', 'text/html');
      res.send("./index1.html");
      next();
    })
    app.ws("/rtsp", rtspRequestHandle)
    app.listen(8888);
    console.log("express listened")
}

localServer();

function rtspRequestHandle(ws, req) {
    console.log("rtsp request handle");
    const stream = webSocketStream(ws, {
        binary: true,
        browserBufferTimeout: 1000000
    }, {
        browserBufferTimeout: 1000000
    });
    let url = req.query.url;
    console.log("rtsp url:", url);
    try {
        ffmpeg(url)
            .addInputOption("-rtsp_transport", "tcp", "-buffer_size", "102400")  // 这里可以添加一些 RTSP 优化的参数
            .on("start", function () {
                console.log(url, "Stream started.");
            })
            .on("codecData", function () {
                console.log(url, "Stream codecData.")
          			// 摄像机在线处理
            })
            .on("error", function (err) {
                console.log(url, "An error occured: ", err.message);
            })
            .on("end", function () {
                console.log(url, "Stream end!");
          			// 摄像机断线的处理
            })
            .outputFormat("flv").videoCodec("copy").noAudio().pipe(stream);
    } catch (error) {
        console.log(error);
    }
}