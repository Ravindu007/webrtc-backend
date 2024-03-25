import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware'; // Import proxy middleware

import { RoomHandler } from './room/intex';

const port = 8080;
const app = express();

// Enable CORS for all routes
app.use(cors());

// Proxy requests to the WebSocket server while including CORS headers
app.use('/socket.io', createProxyMiddleware({
    target: 'https://webrtc-backend-ex84.onrender.com',
    changeOrigin: true,
    ws: true,
    pathRewrite: {
        '^/socket.io': '/socket.io'
    },
    onProxyRes: (proxyRes, req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    }
}));

const server = http.createServer(app);

// socket instance (socket server)
const io = new Server(server);

io.on("connection", (socket) => {
    console.log('user is connected');

    RoomHandler(socket);

    socket.on("disconnect", () => {
        console.log('user is disconnected');
    })
})

server.listen(port, () => {
    console.log("server is running on ", port);
})
