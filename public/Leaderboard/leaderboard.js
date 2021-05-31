$(document).ready(function() {
    $('#profileHeadName').text('Global leaderboard');
    
    getAllUsers();  
    console.log('test' + result);
    console.log(result[0]);

    testTable(result);
    
});

function getAllUsers() {
    $.ajax({
        type: 'GET',
        async: false,
        data: {}, //JSON.stringify(user),
        contentType: 'application/json',
        url: '/api/read-all-leaderboard',
        success: function (data) {
            console.log('success');
            console.log(data);
            result = data;
            console.log(result[0]);
        },
    });
}; 
// --- Creates Leaderboard table and fill it with users, with the highest MMR at the top --- //
function testTable(result){
    var c, r, t, div;
    // Creates the table tag, that the other elements will append
    t = document.createElement('table');
    t.classList.add('table');
    // iterate the result array, which contains all users sorted by MMR
    for(var i = 0; i < result.length; i++){
        r = t.insertRow(0);  // Make one row
        c = r.insertCell(0); // Make one cell in above row
        c.innerText = result[i].u_name;
        c = r.insertCell(1); // Second cell in row
        c.innerText = result[i].mmr;
        //The id on the div that starts the table
        document.getElementById("leaderboard").appendChild(t);
    }
    // This one creates the header, that describes each column
    r = t.insertRow(0); 
    c = r.insertCell(0);
    c.innerText = 'Name';
    c.classList.add('hrFont');
    c = r.insertCell(1);
    c.innerText = 'MMR';
    c.classList.add('hrFont');
};
