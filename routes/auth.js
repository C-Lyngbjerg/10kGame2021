const router = require("express").Router();
const con = require("../util/connection.js");
const bcrypt = require("../util/password.js");

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
                req.session.isAuth = true
                console.log("success: "+loginResult+", isAuth: "+req.session.isAuth+', ID: '+req.session.id);
                // res.send({success:loginResult, isAuth:req.session.isAuth, id:req.session.id});
                res.redirect("/");
            }else{
                console.log("failure: "+loginResult);
                res.send({failure:loginResult});
            }

        }else {
            console.log(err);
        }
    });
});

router.get('/api/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});

router.get('/api/isAuth', (req, res) => {
    if(req.session.isAuth){
        res.send({isAuth:'yes'});
    }else{
        res.send({isAuth:false});
    }
});


module.exports = {
    router
}