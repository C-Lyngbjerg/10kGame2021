const router = require("express").Router();
const con = require("../util/connection.js");
// (async function getProjects() {
//     try{
//         const query = await con.query('SELECT * FROM users',(err, results, fields) => {
//            console.log(results);
//         })
//         console.log(query);
//     }catch (error) {
//         console.log(error);
//     }
// })();

router.get("/api/api-query", (req, res) => {
    con.query('SELECT * FROM users', (err, rows, fields) => {
        if(!err){
            res.send(rows);
        }else {
            console.log(err);
        }
    });
    //res.send({ projects });
});

module.exports = {
    router
}

