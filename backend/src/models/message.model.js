const con = require('../db');

const storeMessage = (message, room_id, sender_id) => {
    return new Promise((resolve, reject) => {
        if (!message || !room_id || !sender_id){
            return reject({
                msg: "All the parameters must be sended."
            });
        }
        let q_create_room = ` 
        INSERT INTO messages (message, room_id, sender_id) 
        VALUES (?,?,?)
        `;
        con.query(q_create_room, [ message, room_id, sender_id ], (err, result) => {
            if (err) return reject(err);
            resolve({
                id: result.insertId,
            });
        });
    });
}

const fetchMessages = (room_id, user_id) => {
    return new Promise((resolve, reject) => {
        let q_check_permission = `
        SELECT * FROM test.user_room where rooms_id = ? and users_id = ?
        `;
        con.query(q_check_permission, [ room_id, user_id ], (err, rows) => {
            if (err) return reject(err);
            if (rows.length != 0) {
                let q = `
                SELECT * FROM (SELECT * FROM messages WHERE room_id = ? order by date desc limit 30) as t order by date;
                `;
                con.query(q, [ room_id ], (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                });
            } else {
                return reject({
                    msg: 'You not belong to this conversation.'
                });
            }
        });

    });
}

exports.storeMessage = storeMessage;
exports.fetchMessages = fetchMessages;