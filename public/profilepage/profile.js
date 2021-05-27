/* 
1. Tag en brugers session 
2. Lad profilepage være afhængig af brugeren ud fra denne session
3. Vis personlig velkomst, mmr m.m
*/

$(document).ready(function () {
    // On load change name of player to actual player username
    console.log("hello");
    getUser();
    $('#profileHeadName').text('Welcome back ' + user.user);
    $('#userName').text(user.user);
    $('#userEmail').text(user.email);
    $('#userMMR').text(user.mmr);
    /*
    titleName.text(user.user + ' is playing vs AI');
    tempName.text(user.user + ': 100');
    bankName.text(user.user + ': 0');
    // get initial diceRolls
    getDiceRolls();
    */
});

function getUser() {
    $.ajax({
        type: 'POST',
        async: false,
        data: {}, //JSON.stringify(user),
        contentType: 'application/json',
        url: '/auth/get-user',
        success: function (data) {
            console.log('success');
            console.log(data);
            user = data;
            console.log(user);
        },
    });
}