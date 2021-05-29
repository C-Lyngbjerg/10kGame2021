
$(document).ready(() => {
    $("#footer-copyright").text('Copyright © ' + new Date().getFullYear());
});

const messageText = $('#message')
const socket = io();
$('#send_button').click(() => {
    console.log(user.u_name);
    // socket.emit('message', {user: user.u_name,chat: chat});
});    
// const form = $('form');
//     // form.addEventListener('submit', function(e) {
//     //     e.preventDefault();
//     //     const inputU = document.querySelector('#user');
//     //     const user = inputU.value;
//     //     const inputC = document.querySelector('#chat');
//     //     const chat = inputC.value;
//     //     socket.emit('message', {user: user,chat: chat});
//     //     inputC.value = '';
//     // });

//     socket.on("response", (data) => {
//             console.log(data);

//             const messageP = document.createElement("p")
//             messageP.innerText = data.user+": "+data.chat; // dont use innerHTML because they can inject html bad stuff through it cross site injection
//             container.appendChild(messageP);
//         //     // document.body.style.backgroundColor = data.color;
//     });