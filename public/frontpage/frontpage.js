// $( "#play_ai_button" ).click( async function () {
//     const user = await fetch('/api/isAuth');
//     const userJSON = await user.json();
//     console.log("isAuth: "+userJSON.isAuth);
    
// });




// $( "#logIn" ).click( async function asyncLoginFunc() {
//     const email =  document.getElementById("email").innerText;
//     const u_password =  document.getElementById("u_password").innerText;
//     console.log(email, u_password);
//     const response = await fetch("/api/login", {
//                     method: "POST",
//                     mode: 'cors', // this cannot be 'no-cors'
//                     headers: {
//                             'Accept': 'application/json',
//                             'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ //formData
//                             // email: email,//document.getElementById("email").innerText,
//                             email: $("#email").text(),
//                             // u_password: u_password//document.getElementById("u_password").innerText
//                             u_password: $("#u_password").text()
//                     })
//             });
//     const body = await response.json();
//     console.log(body);
    
// });
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