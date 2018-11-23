const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/', (req, res) => res.send('ok'));

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, function() {
        console.log(`Express server started on ${PORT}`);
    });
}

module.exports = app;