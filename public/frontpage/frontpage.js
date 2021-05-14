// const con = require("./util/connection.js");
// const dotenv = require('dotenv').config();

(async function getQuery() {
    try{
        const response = await fetch("/api/api-query");
        const result  = await response.json();
        const usersDiv = $("#users");
        console.log(result);
        
        result.map( user => {
            const newUser = $('<li class="list-group-item"></li>');

            newUser.append($('<h2></h2>').text(user.u_name));
            newUser.append($('<p></p>').text("Email: "+user.email));
            newUser.append($('<p></p>').text("Password: "+user.u_password));
            newUser.append($('<p></p>').text("MMR: "+user.mmr));
            newUser.append($('<p></p>'));
            
            usersDiv.append(newUser);
        });
    }catch (error) {
        console.log(error);
    }
})();


// const response = await fetch("/api/projects");
//         const result  = await response.json();
//         const projectsDiv = $("#projects");
        
//         result.projects.map( user => {
//             const newUser = $('<li class="list-group-item"></li>');

//             newUser.append($('<h2></h2>').text(user.title));
//             newUser.append($('<p></p>').text(user.description));
//             newUser.append($('<p></p>').text(user.startDate + " - " + user.endDate));
//             newUser.append($(`<a href=${user.gitLink}></a>`).text(user.projLinkText));
//             newUser.append($('<p></p>'));
            
//             projectsDiv.append(newUser);
//         });