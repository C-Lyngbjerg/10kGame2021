const dotenv = require('dotenv').config();
const mysql  = require('mysql');

const connection = mysql.createPool({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER, 
    password : process.env.DB_PASSWORD, 
    database : process.env.DB_DATABASE
});

//const connection = mysql.createPool({CLEARDB_DATABASE_URL});

module.exports = connection;

