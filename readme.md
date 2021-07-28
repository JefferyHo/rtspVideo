## RTSP视频流转flv,在浏览器播放

### 准备
全局安装 ffmpeg, 并添加全局变量 *ffmpeg*

### 依赖
服务端： 
  -- express-ws
  -- websocket-stream
  -- fluent-ffmpeg

客户端：
  -- flvjs


### 启动

```
  npm start
```

访问: http://localhost:8888/rstp?url= *youraddresshere*