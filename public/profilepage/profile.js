/* 
1. Tag en brugers session 
2. Lad profilepage være afhængig af brugeren ud fra denne session
3. Vis personlig velkomst, mmr m.m
*/

$(document).ready(async function () {
    // On load change name of player to actual player username
    console.log("hello");
    await getUser();
    $('#profileHeadName').text('Welcome back ' + user.user);
    $('#userName').text(user.user);
    $('#userEmail').text(user.email);
    $('#userMMR').text(user.mmr);

});

async function getUser() {
    await $.ajax({
        type: 'POST',
        data: {}, 
        contentType: 'application/json',
        url: '/auth/get-user',
        success: function (data) {
            console.log('success');
            user = data;
        },
    });
}