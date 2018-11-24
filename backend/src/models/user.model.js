const bcrypt = require('bcryptjs');
const con = require('../db');

const createUser = (data) => {
    return new Promise((resolve, reject) => {
        let q = ` 
        INSERT INTO users (username, password, email, name, profile_pic_url) 
        VALUES (?,?,?,?,?)
        `;
        let params = [
            data.username,
            data.password,
            data.email,
            data.name,
            data.profile_pic_url,
        ]
        con.query(q, params, (err) => {
            if (err) reject(err);
            resolve();
        })
    })
}

const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        let q = `
        SELECT username, name, email, profile_pic_url 
        FROM users
        `;
        con.query(q, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
}

exports.createUser = createUser;
exports.getAllUsers = getAllUsers;