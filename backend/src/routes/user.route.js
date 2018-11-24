const router = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();
const { 
    createUser,
    getAllUsers,
    searchUsers,
    login,
} = require('../models/user.model');

router.route('/register')
    .post((req, res) => {
        createUser(req.body)
            .then((data) => {
                res.status(201).json(data);
            })
            .catch((err) => {
                let error_msg = {
                    'msg': 'Email or username duplicated, try another one.'
                };
                res.status(400).json(error_msg);
            });
    });

router.route('/login')
    .post((req, res) => {
        let { username, password } = req.body;
        login(username, password)
            .then((data) => {
                let user_data = {};
                user_data.username = data[0].username;
                user_data.email = data[0].email;
                user_data.name = data[0].name;
                user_data.profile_pic_url = data[0].profile_pic_url;
                res.status(200).json({
                    token: jwt.sign({ id: data[0].id }, process.env.JWT_SECRET),
                    user: user_data,
                });
            })
            .catch((err) => {
                let error_msg = {
                    'msg': 'Incorrect username or password.'
                };
                res.status(400).json(error_msg);
            });
    });

router.route('/users')
    .all(passport.authenticate('jwt', { session: false }))
    .get((req, res) => {
        if (Object.keys(req.query).length > 0) {
            let { q } = req.query;
            searchUsers(q)
                .then((data) => {
                    res.status(200).json(data);
                })
                .catch((err) => {
                    res.status(404).json(err);
                });
        } else {
            getAllUsers()
                .then((data) => {
                    res.status(200).json(data);
                })
                .catch((err) => {
                    res.status(404).json(err);
                });
        }
    });

module.exports = router;