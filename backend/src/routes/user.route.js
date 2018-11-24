const router = require('express').Router();
const { 
    createUser,
    getAllUsers,
    searchUsers,
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

router.route('/users')
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