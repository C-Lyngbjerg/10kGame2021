$('#sign_up').click(function (e) {
    e.preventDefault();
    // let user = {
    //     email: $('#su_email').val(),
    //     u_name: $('#su_u_name').val(),
    //     u_password: $('#su_u_password').val(),
    // };
    $.ajax({
        method: 'POST',
        data: JSON.stringify({
            email: $('#su_email').val(),
            u_name: $('#su_u_name').val(),
            u_password: $('#su_u_password').val(),
        }),
        headers: { 'Content-type': 'application/json' },
        url: '/api/create-user',
        success: function () {
            $('#error-group').css('display', 'none');
            $('#su_email').val('');
            $('#su_u_name').val('');
            $('#su_u_password').val('');
            alert('Your submission was successful');
        },
        error: function (data) {
            $('#error-group').css('display', 'block');
            const errors = JSON.parse(data.responseText);
            let errorsContainer = $('#errors');
            errorsContainer.innerHTML = '';
            let errorsList = '';

            for (let i = 0; i < errors.length; i++) {
                errorsList += '<li>' + errors[i].msg + '</li>';
            }
            errorsContainer.html(errorsList);
        },
    });
});

$('#log_in').click(async function (e) {
    e.preventDefault();
    await $.ajax({
        method: 'POST',
        data: JSON.stringify({
            email: $('#email').val(),
            u_password: $('#u_password').val(),
        }),
        headers: { 'Content-type': 'application/json' },
        url: '/auth/login',
        error: function (data) {
            $('#error-group').css('display', 'block');
            const errors = JSON.parse(data.responseText);
            let errorsContainer = $('#errors');
            errorsContainer.innerHTML = '';
            let errorsList = '';

            for (let i = 0; i < errors.length; i++) {
                errorsList += '<li>' + errors[i].msg + '</li>';
            }
            errorsContainer.html(errorsList);
        },
    });
    document.location.href = "/";
});
