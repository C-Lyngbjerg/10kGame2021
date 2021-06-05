const router = require('express').Router();
const con = require('../util/connection.js');
const bcrypt = require('../util/password.js');
const nodemailer = require('nodemailer');
const env = require('dotenv');
const { prototype } = require('nodemailer/lib/dkim');

const saltRounds = 12;

// ----------------------------- CREATE ----------------------------- //
// Create User
router.post('/api/create-user', async (req, res) => {
    console.log(req.body);
    let user = {
        email: req.body.email,
        u_name: req.body.u_name,
        mmr: 1000,
        u_password: req.body.u_password,
    };

    console.log(user);
    user.u_password = await bcrypt.hashPass(req.body.u_password, saltRounds);
    main(user);
    con.query('INSERT INTO users SET ?', user, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.send({
                code: 400,
                failed: 'error occurred',
                error: error,
            });
        } else {
            console.log(results);
            // res.send({
            // "code":200,
            // "success":"user registered sucessfully",
            // "ID":results.insertID });
            res.redirect('/play');
        }
    });
});

// ----------------------------- READ ----------------------------- //
// Read All
router.get('/api/read-all', (req, res) => {
    con.query('SELECT * FROM `users`', (err, result, fields) => {
        if (!err) {
            res.send(result);
        } else {
            console.log(err);
        }
    });
});
// ---------- Gets users ordered by their MMR, for easier work with Leaderboard feature ------- //
router.get('/api/read-all-leaderboard', (req, res) => {
    con.query('SELECT * FROM `users` ORDER BY mmr', (err, result, fields) => {
        if (!err) {
            res.send(result);
        } else {
            console.log(err);
        }
    });
});

// Read by ID
router.get('/api/read-by-id/:id', (req, res) => {
    const id = req.params.id;
    con.query('SELECT * FROM `users` WHERE id = ?', id, (err, result, fields) => {
        if (!err) {
            res.send(result);
        } else {
            console.log(err);
        }
    });
});

// ----------------------------- UPDATE ----------------------------- //
// Update by ID
router.put('/api/update-by-id/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const u_name = req.body.u_name;
        const email = req.body.email;
        con.query('SELECT * FROM `users` WHERE id = ?', id, (err, result, fields) => {
            if (!err) {
                res.send(result);
            } else {
                console.log(err);
            }
        });

        console.log(user);
    } catch (error) {
        console.log(error);
    }
});

// ----------------------------- DELETE ----------------------------- //
router.delete('/api/delete-user/:id', (req, res) => {
    let id = req.params.id;
    con.query('DELETE FROM `users` WHERE id = ?', id, (err, result, fields) => {
        if (!err) {
            res.send(result);
        } else {
            console.log(err);
        }
    });
});

// ------------------------- NODEMAILER ----------------------------- //
async function main(user) {
    const htmlMessage = `
    <h1>Welcome to 10KGame ${user.u_name}</h1>
    <h4>We are glad that you chose to register with us</h4>
    <p>We have the following information on you: <br> <i>Please check that it is correct</i></p>
    <table>
        <tr>
            <td><b>Username:</b> ${user.u_name}</td><br>
            <td><b>Email:</b> ${user.email}</td>
        </tr>
    </table>
`;
    console.log('this: ', user);
    // create reusable transporter object using the default SMTP transport
    /*let transporter = nodemailer.createTransport({
      host: "imap.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
      tls:{
        rejectUnauthorized:false
        }
    });*/
    const transporter = nodemailer.createTransport({
    service:'Gmail',
    auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
    });

  

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"10KGames" <10KG@mail.dk>', // sender address
        to: user.email, // list of receivers
        subject: 'Welcome', // Subject line
        text: 'Hello world?', // plain text body
        html: htmlMessage, // html body
    });
}

module.exports = {
    router,
};
