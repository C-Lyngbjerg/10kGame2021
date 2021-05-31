
$(document).ready(() => {
    $("#footer-copyright").text('Copyright © ' + new Date().getFullYear());
});

const messageText = $('#message');
const socket = io();
const container = $('#container');
$('#send_button').click(() => {
    console.log(user.u_name);
    console.log(messageText.val());
    socket.emit('message', {user: user.u_name,chat: messageText.val()});
});  

socket.on("response", (data) => {
    console.log(data.response);
    const messageP = $(`<p></p>`).text(data.response);
    container.append(messageP);
    messageText.val("");

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

//     