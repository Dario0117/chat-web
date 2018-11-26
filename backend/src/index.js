const express = require('express');
const routes = require('./routes');
const connection = require('./db');
const passport = require('passport');
const cors = require('cors');
const socketManagement = require('./socket.management');

const app = express();
const PORT = process.env.PORT || 5000;

require('./auth')();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use('/', routes);

if (process.env.NODE_ENV !== 'test') {
    connection.connect((error) => {
        if (error) {
            console.error('Unable to connect to the database:', err);
        } else {
            let server = app.listen(PORT, function () {
                console.log(`Express server started on ${PORT}`);
            });
            socketManagement(server);
        }
    })
}

module.exports = app;