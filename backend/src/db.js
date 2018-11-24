const mysql = require('mysql2');
require('dotenv').config();

mysql_db = process.env.MYSQL_DATABASE;
mysql_host = process.env.MYSQL_HOST;

if (process.env.NODE_ENV === 'test') {
    mysql_db = process.env.MYSQL_TEST_DATABASE;
    mysql_host = process.env.MYSQL_TEST_HOST;
}

const connection = mysql.createConnection({
    host: mysql_host,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: mysql_db,
    multipleStatements: true,
  });

module.exports = connection;
