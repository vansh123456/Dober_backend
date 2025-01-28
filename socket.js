const socketIO = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;
function initializeSocket(server) {
    io = socketIO(server,{
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);
        socket.on('join', async (data) => {
            const { userId, userType } = data;

            console.log(`User ${userId} joined as ${userId} with socket id: ${socket.id}`);
            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        socket.on('update-location-captain',async(data) => {
            const {userId,location} = data;
            if(!location|| !location.ltd || !location.lng){
                return socket.emit('error','Invalid location');
            }
            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            });
        })

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

function sendMessageToSocketId(socketId, messageObject) {
    console.log(`sending message to ${socketId}`,messageObject);
    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}
module.exports = { initializeSocket, sendMessageToSocketId };