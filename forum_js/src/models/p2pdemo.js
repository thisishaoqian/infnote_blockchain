// node p2pdemo.js to compile it
"use strict";

var _ws = require("ws");

var _readline = _interopRequireDefault(require("readline"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ws = new _ws.Server({
  port: 8080
});

var readline = _readline.default.createInterface({
  input: process.stdin,
  output: process.stdout
});

ws.on('connection', function (socket, r) {
  console.log('Incoming: ' + r.connection.remoteAddress);
  socket.on('message', function (msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write('< ' + msg + '\n> ');
  });

  var reading = function reading() {
    readline.question('> ', function (content) {
      socket.send(content);
      reading();
    });
  };

  reading();
});