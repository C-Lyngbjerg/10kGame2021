const router = require('express').Router();
const con = require('../util/connection.js');
const bcrypt = require('../util/password.js');
const cors = require('cors');
const { check, validationResult } = require('express-validator');

// Login
/*
SELECT WHERE query with prepared statement that creates an async callback to then use the bcrypt compare function 
of unhashed password from login attempt and hashed password from db and returns boolean which we can send the 
login page in future for redirect based on that.
*/
router.post(
    '/auth/login',
    [
        check('email').isEmail().withMessage("Email is not valid. Use format 'xxx@xxx.xxx'"),
        check('u_password').isLength({ min: 6 }).withMessage('Password is incorrect')
    ],
    cors(),
    (req, res) => {
        let user = {
            email: req.body.email,
            u_password: req.body.u_password,
        };
        const result = validationResult(req);
        if (!result.isEmpty()) {
            console.log(result);
            console.log(result.errors[0].msg);
            
            return res.status(422).jsonp(result.array());
        }
        let loginResult;
        con.query('SELECT * FROM `users` WHERE email = ?', user.email, async (err, result, fields) => {
                if (!err) {
                    loginResult = await bcrypt.comparePass(user.u_password, result[0].u_password);
                    if (loginResult) {
                        req.session.isAuth = true;
                        req.session.u_id = result[0].id;
                        req.session.email = result[0].email;
                        req.session.u_name = result[0].u_name;
                        req.session.mmr = result[0].mmr;

                        console.log('successfully logged in');
                        res.redirect('/');
                    } else {
                        console.log('failure: ' + loginResult);
                    }
                } else {
                    console.log(err);
                }
            },
        );
    },
);

router.get('/auth/logout', cors(), (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

router.get('/auth/is_auth', (req, res) => {
    if (req.session.isAuth) {
        console.log(req.session.isAuth);
        res.redirect('/play');
    } else {
        console.log(req.session.isAuth);
        res.redirect('/login');
    }
});

router.post('/auth/get-user', (req, res) => {
    if (req.session.isAuth) {
        console.log(req.session.isAuth);
        console.log('isAuth');

        const user = {
            user: req.session.u_name,
            email: req.session.email,
            u_id: req.session.u_id,
            mmr: req.session.mmr,
        };
        res.send(user);
    } else {
        res.redirect('/login');
    }
});

module.exports = {
    router,
};
