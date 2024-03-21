import { Socket } from "socket.io";
import {v4 as uuidV4} from 'uuid'


interface IRoomParams {
    roomId:string;
    peerId:string;
}

// list of Roooms and for each Room, it got a list of peers of that room 
const rooms: Record<string, string[]> = {};


export const RoomHandler = (socket: Socket) => {
    // event-handlers
    const createRoom = () => {
        console.log("room-created");
        const roomId = uuidV4();

        // define a LIST OF PEERS for a room (when a peer JOINS the room we have to push his id to this array)
        rooms[roomId] = []

        socket.emit("room-created", {roomId}) //send message to client that room is created
    }
    
    const leaveRoom = ({peerId, roomId}:IRoomParams) => {
        rooms[roomId] = rooms[roomId].filter(id => id !== peerId);
        socket.to(roomId).emit("user-disconnected", peerId);
    }

    const joinRoom = ({roomId, peerId} : IRoomParams) => {
        if(rooms[roomId]){
            console.log("user has joined the room", roomId)
            rooms[roomId].push(peerId);
            socket.join(roomId);
    
            // get a list of peers in the room
            socket.emit('get-users', {
                roomId,
                participants: rooms[roomId]
            })
        }

        socket.on("disconnect", ()=>{
            console.log("user left the room", peerId);
            leaveRoom({roomId, peerId});
        })
    }


    // events
    socket.on("create-room", createRoom)
    socket.on("join-room", joinRoom)


}