let user;

$(document).ready(function() {
    $.ajax({
        type: 'POST',
        async:false,
        data: {},//JSON.stringify(user),
        contentType: 'application/json',
        url: '/auth/get-user',						
        success: function(data) {
            console.log('success');
            console.log(data);
            user = data
            console.log(user);
        }
    });
    $("#titleName").text(user.user+' is playing vs AI');
});