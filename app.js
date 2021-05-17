const express = require('express');
const app = express();

const fs = require("fs");
const con = require("./util/connection.js");
const dotenv = require('dotenv').config();
const session = require('express-session'); // npm i express-session

app.use(session({
    secret: process.env.SECRET, // put in .env
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // if HTTPS true otherwise false
}));

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const pubDir = __dirname+"/public";

const header = fs.readFileSync(pubDir+'/header/header.html', 'utf-8');
// const headerUser = fs.readFileSync(pubDir+'/header/headerUser.html', 'utf-8');
const footer = fs.readFileSync(pubDir+'/footer/footer.html', 'utf-8');

const frontPage = fs.readFileSync(pubDir+"/frontpage/frontpage.html", "utf-8");
const loginPage = fs.readFileSync(pubDir+"/login/login.html", "utf-8");
const playPage = fs.readFileSync(pubDir+"/play/play.html", "utf-8");


const queryRouter = require("./routes/query.js");
app.use(queryRouter.router);
const authRouter = require("./routes/auth.js");
app.use(authRouter.router);

// function setNavActive(navItem) {
//     return header.replace(`"nav-link" href="/${navItem}`, `"nav-link active" href="/${navItem}`)
// }

function setNavAuthState() {
    return header.replace('href="/login"> Log In</a>','href="/logout"> Log Out</a>')
}

app.get("/", (req, res) => {
    if(req.session.isAuth){
        res.send(setNavAuthState()+frontPage+footer);
    }else{
        res.send(header+frontPage+footer);
    }
    
});

app.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        console.log('session ended');
        res.redirect('/');
    });

});

app.get('/login',(req,res) => {
    res.send(header+loginPage+footer);

});

app.get('/play',(req,res) => {
    res.send(header+playPage+footer);  

    /* disabled for ease of testing
    if(req.session.isAuth){
        console.log(req.session.isAuth);
        res.send(headerUser+playPage+footer);  
    }else{
        res.redirect("/login");
    }
    */
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, (error) => {
    if(error){
        console.log('An error has occured: ', error);
    }else {
        console.log('Server is now running on port ', Number(PORT));
    }
});