const router = require('express').Router();
const { createUser } = require('../models/user.model');

router.route('/register')
    .post((req, res) => {
        createUser(req.body)
            .then((data) => {
                res.status(201).json(data);
            })
            .catch((err) => {
                res.status(400).json(err);
            });
    });

module.exports = router;