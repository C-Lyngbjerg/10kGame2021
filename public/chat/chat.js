const messageText = $('#message');
const socket = io();
const container = $('#container');
let user = {};

$(document).ready(async () => {
    // On load retrieves user information from /game/get-user from session information
    await getUser();
});


$('#send_button').click(() => {
    console.log(user.u_name);
    console.log(messageText.val());
    messageText.val("");
    socket.emit('message', {user: user.u_name,chat: messageText.val()});
});  

socket.on("response", (data) => {
    console.log(data.response);
    const messageP = $(`<p></p>`).text(data.response);
    container.append(messageP);
    

});


async function getUser() {
    await $.ajax({
        method: 'POST',
        data: {}, //JSON.stringify(user),
        headers: { 'Content-type': 'application/json' },
        url: '/auth/get-user',
        success: (data) => {
            console.log('getUser: ', data);
            user = {
                u_id: data.u_id,
                email: data.email,
                u_name: data.user,
                mmr: data.mmr,
            };
        },
    });
}