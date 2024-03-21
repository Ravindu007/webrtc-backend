"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomHandler = void 0;
const uuid_1 = require("uuid");
// list of Roooms and for each Room, it got a list of peers of that room
const rooms = {};
const RoomHandler = (socket) => {
    // event-handlers
    const createRoom = () => {
        console.log("room-created");
        const roomId = (0, uuid_1.v4)();
        // define a LIST OF PEERS for a room (when a peer JOINS the room we have to push his id to this array)
        rooms[roomId] = [];
        socket.emit("room-created", { roomId }); // send message to client that room is created
    };
    const leaveRoom = ({ peerId, roomId }) => {
        rooms[roomId] = rooms[roomId].filter(id => id !== peerId);
        socket.to(roomId).emit("user-disconnected", peerId);
    };
    const joinRoom = ({ roomId, peerId }) => {
        if (rooms[roomId]) {
            console.log("user has joined the room", roomId);
            rooms[roomId].push(peerId);
            socket.join(roomId);
            // catch user joined event
            socket.to(roomId).emit("user-joined", { peerId });
            // get a list of peers in the room
            socket.emit('get-users', {
                roomId,
                participants: rooms[roomId]
            });
        }
        socket.on("disconnect", () => {
            console.log("user left the room", peerId);
            leaveRoom({ roomId, peerId });
        });
    };
    // events
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
};
exports.RoomHandler = RoomHandler;
