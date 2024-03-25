import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { RoomHandler } from './room/intex';

const port = 8080;
const app = express();
app.use(cors({
    origin: '*'
}));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-requested-Width, Content-Type, Accept"
    )
    next()
})

const server = http.createServer(app);

// socket instance (socket server)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

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