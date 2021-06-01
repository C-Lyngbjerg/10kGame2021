const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require('fs');
const dotenv = require('dotenv').config();
const session = require('express-session'); // npm i express-session
const cors = require('cors');
let user = {};

// app.use(cors());

app.use(
    session({
        secret: process.env.SECRET, // put in .env
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // if HTTPS true otherwise false
    }),
);

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const pubDir = __dirname + '/public';

const header = fs.readFileSync(pubDir + '/header/header.html', 'utf-8');
const footer = fs.readFileSync(pubDir + '/footer/footer.html', 'utf-8');

const frontPage = fs.readFileSync(pubDir + '/frontpage/frontpage.html', 'utf-8');
const loginPage = fs.readFileSync(pubDir + '/login/login.html', 'utf-8');
const playPage = fs.readFileSync(pubDir + '/play/play.html', 'utf-8');
const profilepage = fs.readFileSync(pubDir + '/profilepage/profile.html','utf-8');
const leaderboardpage = fs.readFileSync(pubDir + '/leaderboardpage/leaderboard.html','utf-8');
const rulepage = fs.readFileSync(pubDir + '/rules/rules.html','utf-8');
const chatPage = fs.readFileSync(pubDir + '/chat/chat.html', 'utf-8');

const queryRouter = require('./routes/query.js');
const authRouter = require('./routes/auth.js');
const gameRouter = require('./routes/game.js');

app.use(queryRouter.router);
app.use(authRouter.router);
app.use(gameRouter.router);

/*
The following function is a nice way to replace items in html files
below this general example is a more specific one that probably should be written more generally at a later time 
CLB - 21.05.18

function setNavActive(navItem) {
    return header.replace(`"nav-link" href="/${navItem}`, `"nav-link active" href="/${navItem}`)
}
*/

function setNavAuthState() {
    return header.replace('href="/login"> Log In</a>', 'href="/logout"> Log Out</a>');
}

app.get('/', cors(), (req, res) => {
    if (req.session.isAuth) {
        res.send(setNavAuthState() + frontPage + footer);
    } else {
        res.send(header + frontPage + footer);
    }
});

app.get('/login', cors(), (req, res) => {
    res.send(header + loginPage + footer);
});

app.get('/*', (req, res, next) => {
    if (!req.session.isAuth) return res.redirect('/login');
    next();
});

app.get('/logout', cors(), (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        console.log('session ended');
        res.redirect('/');
    });
});

app.get('/chat', cors(), (req,res) => {
    res.send(header + chatPage + footer);
});

app.get('/play', cors(), (req, res) => {
    res.send(header + playPage + footer);

    /* 
    disabled for ease of testing as of 21.05.18

    if(req.session.isAuth){
        console.log(req.session.isAuth);
        res.send(headerUser+playPage+footer);  
    }else{
        res.redirect("/login");
    }
    */
});


app.get("/profile", cors(), (req,res) => {
    res.send(header + profilepage + footer);
});

app.get("/leaderboard", cors(), (req,res) => {
    res.send(header + leaderboardpage + footer);
});

app.get("/rules", cors(), (req,res) => {
    res.send(header + rulepage + footer);
});

// app.get('/*', (req, res) => {
//     // implement errorPage
//     // res.send(header + errorPage + footer);

// });

const PORT = process.env.PORT || 8080;
server.listen(PORT, (error) => {
    if (error) {
        console.log('An error has occured: ', error);
    } else {
        console.log('Server is now running on port ', Number(PORT));
    }
});

/* Chat */
io.on('connection', (socket) => {
    console.log('A socket connected with id: ', socket.id);
    socket.on('message', (data) => {
        console.log(`${data.user}: ${data.chat}`);
        chatRes = { response: `${data.user}: ${data.chat}` };
        io.emit('response', chatRes); // broadcast emit user: chat
    });
});


