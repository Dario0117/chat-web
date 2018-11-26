const socket = require('socket.io');
const { getUsersFromRoom } = require('./models/room.model');
const { storeMessage } = require('./models/message.model');

let SocketConnections = {};

module.exports = (server) => {
    io = socket(server);
    io.on('connection', (socket) => {
        socket.on('AUTHENTICATE', (data) => {
            SocketConnections[`${data.client_id}`] = {
                socket,
                client_id: data.client_id,
                name: data.name,
            };
        });

        socket.on('disconnect', () => {
            let client_id;
            for(let k in SocketConnections){
                if (SocketConnections[k].socket.id === socket.id){
                    client_id = SocketConnections[k].client_id;
                    break;
                }
            }
            delete SocketConnections[`${client_id}`];
        });

        socket.on('CLIENT_SEND_MESSAGE', async (data) => {
            let message = await storeMessage(data.message, data.conversation_id, data.sender_id);
            let users = await getUsersFromRoom(data.conversation_id)
            for (let user of users) {
                if (user.id in SocketConnections) {
                    let socket = SocketConnections[`${user.id}`].socket;
                    io.to(`${socket.id}`).emit('SERVER_SEND_MESSAGE', message);
                }
            }
        });
    });
}