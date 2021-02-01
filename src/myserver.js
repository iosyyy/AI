const { send } = require("process");

var app = require("http").createServer();
var io = require("socket.io")(app,{ cors: true });

let sendMessage = (socket) => {
  let acc = 45;
  let now = new Date().getTime();
  let id = setInterval(()=>{
    acc = acc + Math.random()*10
    let res = (acc + '').slice(0,5) + '%';
    setTimeout(() => {}, 1000);
    let interval = (((new Date().getTime() - now) / 1000)+'').slice(0,5);

    if(acc>=100) clearInterval(id)
    console.log({ code: 0, acc:res, time: `${interval}s` })
    socket.emit("by normal", { code: 0, acc:res, time: `${interval}s` });
  },2000)
};

io.on("connection", function (socket) {
  console.log("有一个客户端连接上了服务器");
  socket.on("by normal", function (data) {
    console.log("得到来自客户端的数据", data);
    sendMessage(socket);
  });
});

app.listen(8080);
