const router = require("express").Router();
const con = require("../util/connection.js");
const bcrypt = require("../util/password.js");
const saltRounds = 12;

// ----------------------------- CREATE ----------------------------- //
// Create User
router.post("/api/create-user", async (req, res) => {
    let user = {
        email: req.body.email,
        u_name: req.body.u_name,
        mmr: 1000,
        u_password: req.body.u_password
    }

    user.u_password = await bcrypt.hashPass(req.body.u_password, saltRounds);
    
    con.query('INSERT INTO users SET ?',user, (error, results, fields) => {      
        if (error) {   
            console.log(error);     
            res.send({          
            "code":400,          
            "failed":"error occurred",          
            "error" : error });      
        } else {    
            console.log(results);    
            res.send({          
            "code":200,          
            "success":"user registered sucessfully",
            "ID":results.insertID });        
        }    
    });
});

// ----------------------------- READ ----------------------------- //
// Read All 
router.get("/api/read-all", (req, res) => {
    con.query('SELECT * FROM `users`', (err, result, fields) => {
        if(!err){
            res.send(result);
        }else {
            console.log(err);
        }
    });
});

// Read by ID
router.get("/api/read-by-id/:id", (req, res) => {
    const id = req.params.id;
    con.query('SELECT * FROM `users` WHERE id = ?',id, (err, result, fields) => {
        if(!err){
            res.send(result);
        }else {
            console.log(err);
        }
    });
});

// ----------------------------- UPDATE ----------------------------- //
// Update by ID
router.put("/api/update-by-id/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const u_name = req.body.u_name;
        const email = req.body.email;
        con.query('SELECT * FROM `users` WHERE id = ?',id, (err, result, fields) => {
            if(!err){
                res.send(result);
            }else {
                console.log(err);
            }
        });

        console.log(user);
    }catch (error) {
        console.log(error);
    }
    
});


// ----------------------------- DELETE ----------------------------- //
router.delete("/api/delete-user/:id", (req, res) => {
    let id = req.params.id;
    con.query('DELETE FROM `users` WHERE id = ?',id,  (err, result, fields) => {
        if(!err){
            res.send(result);
        }else {
            console.log(err);
        }
    });
});


// Login
/*
SELECT WHERE query with prepared statement that creates an async callback to then use the bcrypt compare function 
of unhashed password from login attempt and hashed password from db and returns boolean which we can send the 
login page in future for redirect based on that.
*/
router.post("/api/login", (req, res) => {
    let user = {
        email: req.body.email,
        u_password: req.body.u_password
    }
    let loginResult;
    con.query('SELECT (u_password) FROM `users` WHERE email = ?', user.email , async (err, result, fields) => {
        if(!err){
            loginResult = await bcrypt.comparePass(user.u_password, result[0].u_password, () => {
                
            });
            if(loginResult){
                console.log("success: "+loginResult);
                res.send({success:loginResult});
            }else{
                console.log("failure: "+loginResult);
                res.send({failure:loginResult});
            }

        }else {
            console.log(err);
        }
    });
});




module.exports = {
    router
}


/*
Delete by ID post request to avoid sending id as param
router.post("/api/delete-user", (req, res) => {
    con.query('DELETE FROM `users` WHERE id = ?',req.body.id,  (err, result, fields) => {
        if(!err){
            res.send(result);
        }else {
            console.log(err);
        }
    });
});
*/
