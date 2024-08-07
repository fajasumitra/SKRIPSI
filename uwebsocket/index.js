const uWS = require('uWebSockets.js');
const fs = require('fs');
const path = require('path');

// Serve the HTML file
const htmlFilePath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

const app = uWS.App().ws('/*', {
  open: (ws) => {
    console.log('A WebSocket connected');
    ws.subscribe('broadcast'); // Subscribe to a topic for broadcasting messages
  },
  message: (ws, message, isBinary) => {
    const msgString = Buffer.from(message).toString();
    console.log('Received message:', msgString);

    // Broadcast the message to all clients subscribed to 'broadcast'
    app.publish('broadcast', msgString);
  },
  close: (ws, code, message) => {
    console.log('A WebSocket disconnected');
  }
}).get('/*', (res, req) => {
  // Serve the HTML file for any GET request
  res.writeHeader('Content-Type', 'text/html');
  res.end(htmlContent);
}).listen(9001, (token) => {
  if (token) {
    console.log('Listening to port 9001');
  } else {
    console.log('Failed to listen to port 9001');
  }
});
