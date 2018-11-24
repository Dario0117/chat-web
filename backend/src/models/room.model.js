const con = require('../db');

const createRoom = ({ message = "", users = [], name = null }) => {
    return new Promise((resolve, reject) => {
        let q_create_room = ` 
        INSERT INTO rooms (name) 
        VALUES (?)
        `;
        con.query(q_create_room, [ name ], (err, result) => {
            if (err) return reject(err);
            let room_id = result.insertId;
            let q_asociate_user_with_room = "INSERT INTO user_room (users_id, rooms_id) VALUES ";
            let params = []
            let sender_id;
            for(let id of users){
                q_asociate_user_with_room += "(?,?), ";
                params.push(id);
                params.push(room_id);
                sender_id = id;
            }
            q_asociate_user_with_room = q_asociate_user_with_room.slice(0, -2);
            q_asociate_user_with_room += "; INSERT INTO messages (message, room_id, sender_id) VALUES (?,?,?);";
            params.push(message);
            params.push(room_id);
            params.push(sender_id);
            con.query(q_asociate_user_with_room, params, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    });
}

exports.createRoom = createRoom;