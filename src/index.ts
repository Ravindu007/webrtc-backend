// require("dotenv").config();
import cors from 'cors';
import express from 'express';
import http from 'http';
import {Server} from 'socket.io'
import { RoomHandler } from './room';

const app = express();
app.use(cors);
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin:"*",
        methods:['GET', 'POST']
    }
});

// initialize the connection of web socket server
io.on('connection', (socket)=>{
    console.log('user connected');

    RoomHandler(socket);

    socket.on('disconnect', ()=>{
        console.log('user disconnected');
    })
})

server.listen(8080, () => {
    console.log("Server is running on port:", 8080);
})
