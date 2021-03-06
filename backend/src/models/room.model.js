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
                resolve({
                    id: room_id,
                });
            });
        });
    });
}

const searchRooms = (search_string, user_id) => {
    return new Promise((resolve, reject) => {
        let q = `
        SELECT 
            distinct r.id,
            r.name
        FROM 
            rooms r,
            user_room ur
        WHERE r.name LIKE ?
            AND r.id IN (SELECT rooms_id FROM user_room ur2 where ur2.users_id = ?)
        LIMIT 20
        `;
        let qp = [
            '%' + search_string + '%', 
            user_id
        ];
        con.query(q, qp, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

const getAllRooms = (user_id) => {
    return new Promise((resolve, reject) => {
        let q = `
        SELECT 
            distinct r.id,
            COALESCE(r.name, (
                        SELECT name 
                        FROM user_room ur2, users us 
                        where ur2.users_id <> ? and us.id = ur2.users_id  and ur2.rooms_id = r.id limit 1
                        )
                    ) as name
        FROM 
            rooms r
        WHERE r.id IN (SELECT rooms_id FROM user_room ur3 where ur3.users_id = ?)
        `;
        con.query(q, [ user_id, user_id ], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

const getUsersFromRoom = (room_id) => {
    return new Promise((resolve, reject) => {
        let q = `
        SELECT 
            users.id,
            users.name,
            users.profile_pic
        FROM 
            user_room ur 
        right join users on ur.users_id = users.id
        where 
            ur.rooms_id = ?
        ;
        `;
        con.query(q, [ room_id ], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

exports.createRoom = createRoom;
exports.searchRooms = searchRooms;
exports.getAllRooms = getAllRooms;
exports.getUsersFromRoom = getUsersFromRoom;