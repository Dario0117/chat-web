const router = require('express').Router();
const passport = require('passport');
const { 
    createRoom,
    searchRooms,
    getAllRooms,
    getUsersFromRoom,
} = require('../models/room.model');

const { fetchMessages } = require('../models/message.model');

router.route('/rooms')
    .all(passport.authenticate('jwt', { session: false }))
    .post((req, res) => {
        let body = {
            message: req.body.message,
            users: req.body.receivers.concat(req.user.id),
            name: req.body.name || null,
        };
        if (body.users.length > 2 && body.name === null) {
            res.status(400).json({
                msg: "You need a name for this group."
            });
        } else {
            createRoom(body)
                .then((data) => {
                    res.status(201).json(data);
                })
                .catch(() => {
                    res.status(400).json({
                        msg: "Can't create this conversation, please try with another users."
                    });
                });
        }
    })
    .get((req, res) => {
        if (Object.keys(req.query).length > 0) {
            let { q } = req.query;
            searchRooms(q, req.user.id)
                .then((data) => {
                    res.status(200).json(data);
                })
                .catch((err) => {
                    res.status(404).json(err);
                });
        } else {
            getAllRooms(req.user.id)
                .then((data) => {
                    res.status(200).json(data);
                })
                .catch((err) => {
                    res.status(404).json(err);
                });
        }
    });

// TEMPORAL ENDPOINT
router.route('/rooms/:id')
    .all(passport.authenticate('jwt', { session: false }))
    .get((req, res) => {
        fetchMessages(req.params.id, req.user.id)
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(404).json(err);
            });
    });

// TEMPORAL ENDPOINT
router.route('/rooms/:id/users')
    .all(passport.authenticate('jwt', { session: false }))
    .get((req, res) => {
        getUsersFromRoom(req.params.id, req.user.id)
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(404).json(err);
            });
    });

module.exports = router;