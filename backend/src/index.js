const express = require('express');
const routes = require('./routes');
const connection = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/', routes);

if (process.env.NODE_ENV !== 'test') {
    connection.connect((error) => {
        if (error) {
            console.error('Unable to connect to the database:', err);
        }else {
            app.listen(PORT, function() {
                console.log(`Express server started on ${PORT}`);
            });
        }
    })
}

module.exports = app;