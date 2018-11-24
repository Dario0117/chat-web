const router = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { 
    createRoom,
} = require('../models/room.model');

router.route('/rooms')
    .all(passport.authenticate('jwt', { session: false }))
    .post((req, res) => {
        let body = {
            message: req.body.message,
            users: req.body.receivers.concat(req.user.id),
        };
        createRoom(body)
            .then((data) => {
                res.status(201).json(data);
            })
            .catch(() => {
                res.status(400).send({
                    msg: "Can't create this conversation, please try with another users."
                });
            });
    });

module.exports = router;