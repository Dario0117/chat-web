const bcrypt = require('bcryptjs');
const con = require('../db');

const createUser = (data) => {
    return new Promise((resolve, reject) => {
        let q = ` 
        INSERT INTO users (username, password, email, name) 
        VALUES (?,?,?,?)
        `;
        let salt = bcrypt.genSaltSync(10);
        let pw = bcrypt.hashSync(data.password, salt);
        let params = [
            data.username,
            pw,
            data.email,
            data.name,
        ];
        con.query(q, params, (err, result) => {
            if (err) return reject(err);
            resolve({
                id: result.insertId,
            });
        });
    });
}

const getAllUsers = (user_id) => {
    return new Promise((resolve, reject) => {
        let q = `
        SELECT id, username, name, email, profile_pic 
        FROM users
        WHERE id <> ?
        `;
        con.query(q, [ user_id ], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

const searchUsers = (search_string) => {
    return new Promise((resolve, reject) => {
        let q = `
        SELECT * FROM users 
        where username LIKE ? or name LIKE ?;
        `;
        let qp = [
            '%' + search_string + '%', 
            '%' + search_string + '%'
        ];
        con.query(q, qp, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

const login = (username, password) => {
    return new Promise((resolve, reject) => {
        let q = `
        SELECT * FROM users where username = ?
        `;
        con.query(q, [username], (err, rows) => {
            if (err) return reject(err);
            if (bcrypt.compareSync(password, rows[0].password)){
                resolve(rows);
            }else {
                reject({
                    msg: 'Wrong password.',
                })
            }
        });
    });
}

const getUserByID = (id) => {
    return new Promise((resolve, reject) => {
        let q = `
        SELECT * FROM users where id = ?
        `;
        con.query(q, [id], (err, rows) => {
            if (err) reject(err);
            resolve(rows[0]);
        });
    });
}

const updateProfilePic = (profile_pic, user_id) => {
    return new Promise((resolve, reject) => {
        let q = ` 
        UPDATE users SET profile_pic = ? where id = ?
        `;
        let params = [
            profile_pic,
            user_id,
        ];
        con.query(q, params, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}

exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
exports.searchUsers = searchUsers;
exports.login = login;
exports.getUserByID = getUserByID;
exports.updateProfilePic = updateProfilePic;