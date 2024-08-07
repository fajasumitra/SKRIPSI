// Server setup
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const server = http.createServer(app);
const { join } = require("path");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Websocket Setup
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    // console.log('A user connected');

    ws.on('message', function incoming(message) {
        // console.log(`Received message: ${message}`);
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
                // console.log(`Broadcasting message: ${message}`);
            }
        });
    });

    ws.on('close', function close() {
        // console.log('A user disconnected');
    });
});

//Route
app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
});

// Start the server
server.listen(3000, () => console.log(`Server running on port 3000`));
