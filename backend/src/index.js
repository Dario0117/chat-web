const express = require('express');
const routes = require('./routes');
const connection = require('./db');
const passport = require('passport');
const cors = require('cors');
const socket = require('socket.io');
const { getUsersFromRoom } = require('./models/room.model');
const { storeMessage } = require('./models/message.model');

const app = express();
const PORT = process.env.PORT || 5000;

require('./auth')();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use('/', routes);

let SocketConnections = {};

if (process.env.NODE_ENV !== 'test') {
    connection.connect((error) => {
        if (error) {
            console.error('Unable to connect to the database:', err);
        } else {
            let server = app.listen(PORT, function () {
                console.log(`Express server started on ${PORT}`);
            });

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
    })
}

module.exports = app;