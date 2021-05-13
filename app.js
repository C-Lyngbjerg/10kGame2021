const express = require('express');
const app = express();

const con = require("./util/connection.js");
const dotenv = require('dotenv').config();

let resultArr = [];

const queryText = 'SELECT * FROM users';

// const testQ = mysql.query('SELECT * FROM users',(err, results, fields) => {
//     // console.log(results); // results contains rows returned by server
//     // console.log(fields); // fields contains extra meta data about results, if available
//     resultArr = results;

//     /*
//     resultArr = results.map((result) => {
//         const resObj = 
//         {
//             id: result.id, 
//             email: result.email, 
//             password: result.u_password, 
//             name: result.u_name, 
//             mmr: result.mmr
//         };
//         return resObj
//     });
//     */
//   });

app.get("/", (req, res) => {
    // con.query(queryText, (err, rows, fields) => {
    //     if(!err){
    //         res.send(rows);
    //     }else {
    //         console.log(err);
    //     }
    // });
    res.send({greetings: "hello"});
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, (error) => {
    if(error){
        console.log('An error has occured: ', error);
    }else {
        console.log('Server is now running on port ', Number(PORT));
    }
});