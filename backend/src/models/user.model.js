const bcrypt = require('bcryptjs');
const con = require('../db');

const createUser = (data) => {
    return new Promise((resolve, reject) => {
        let q = ` 
        INSERT INTO users (username, password, email, name) 
        VALUES (?,?,?,?)
        `;
        let params = [
            data.username,
            data.password,
            data.email,
            data.name,
        ];
        con.query(q, params, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}

const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        let q = `
        SELECT username, name, email, profile_pic 
        FROM users
        `;
        con.query(q, (err, rows) => {
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
        SELECT * FROM users where username = ? and password = ?
        `;
        con.query(q, [username, password], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
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