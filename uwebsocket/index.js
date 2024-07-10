const uWS = require('uWebSockets.js');

const app = uWS.App().ws('/*', {
  open: (ws) => {
    // console.log('A WebSocket connected');
  },
  message: (ws, message, isBinary) => {
    // console.log('Received message:', message);
    ws.send('Hello WebSocket Client!');
  },
  close: (ws, code, message) => {
    // console.log('A WebSocket disconnected');
  }
}).listen(9001, (token) => {
  if (token) {
    // console.log('Listening to port 9001');
  } else {
    // console.log('Failed to listen to port 9001');
  }
});
