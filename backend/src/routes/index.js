const router = require('express').Router();
const user = require('./user.route');
const room = require('./room.route');

router.use('/', user);
router.use('/', room);

module.exports = router;