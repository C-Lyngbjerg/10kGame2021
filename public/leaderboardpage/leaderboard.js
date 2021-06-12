$(document).ready(async function () {
    $('#profileHeadName').text('Global leaderboard');

    await getAllUsers();
});

async function getAllUsers() {
    $.ajax({
        url: '/api/read-all-leaderboard',
        success: function (data) {
            console.log('success');
            console.log(data);
            result = data;
            console.log(result[0]);
            testTable(result);
        },
    });
}

// --- Creates Leaderboard table and fill it with users, with the highest MMR at the top --- //
function testTable(result) {
    let cell, row, table, div;
    // Creates the table tag, that the other elements will append
    table = document.createElement('table');
    table.classList.add('table');
    // iterate the result array, which contains all users sorted by MMR
    for (let i = 0; i < result.length; i++) {
        row = table.insertRow(0); // Make one row
        cell = row.insertCell(0); // Make one cell in above row
        cell.innerText = result[i].u_name;
        cell = row.insertCell(1); // Second cell in row
        cell.innerText = result[i].mmr;
        //The id on the div that starts the table
        document.getElementById('leaderboard').appendChild(table);
    }
    // This one creates the header, that describes each column
    row = table.insertRow(0);
    cell = row.insertCell(0);
    cell.innerText = 'Name';
    cell.classList.add('hrFont');
    cell = row.insertCell(1);
    cell.innerText = 'MMR';
    cell.classList.add('hrFont');
}
