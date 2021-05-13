const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send({greetings: 'hello there'});
});

app.listen(PORT, (error) => {
    if(error){
        console.log('An error has occured: ', error);
    }else {
        console.log('Server is now running on port ', Number(PORT));
    }
});