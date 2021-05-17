const express = require('express');
const app = express();

const fs = require("fs");
const con = require("./util/connection.js");
const dotenv = require('dotenv').config();

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const pubDir = __dirname+"/public";

const header = fs.readFileSync(pubDir+"/header.html", "utf-8");
const footer = fs.readFileSync(pubDir+"/footer.html", "utf-8");

const frontpage = fs.readFileSync(pubDir+"/frontpage/frontpage.html", "utf-8");


const queryRouter = require("./routes/query.js");
app.use(queryRouter.router);

app.get("/", (req, res) => {
    res.send(header+frontpage+footer);
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, (error) => {
    if(error){
        console.log('An error has occured: ', error);
    }else {
        console.log('Server is now running on port ', Number(PORT));
    }
});