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

exports.createUser = createUser;