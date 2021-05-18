let user;


$(document).ready(function() {
    
    // On load change name of player to actual player username
    getUser();
    $("#titleName").text(user.user + ' is playing vs AI');

    // get initial diceRolls
    getDiceRolls();
});


/* 
    On click for roll button
    Which has to do the following in order:
    1. check chosen dice and calculate points 
    2. add to temporary points
    3. roll new dice
*/
$('#roll_button').click( function () {
    
    // 1. Calculate points for chosen dice
    calculatePoints();
    
    // 2. Add to the temporary points total 
    addToTempPoints();

    // 3. Retrieve new dice rolls from game.js
    getDiceRolls();
});

/*
    On click for bank button
    1. get points from temporary points
    2. add to banked points
    3. clear temporary points
    4. end turn
*/
$('#bank_button').click( function () {
    
    
});

// sets let user to req.session user 
const getUser = function(){
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
}

const getDiceRolls = function(){
    $.ajax({ 
        type: 'POST',
        async:false,
        data: {},//JSON.stringify(user),
        contentType: 'application/json',
        url: '/game/get-dice-rolls',						
        success: function(data) {
            console.log('success');
            console.log(data);
            const diceList = $('#dice_list');
            diceList.empty();
            diceArray = data.map(die => {
                if(die.value !== -1){
                    console.log(die.name, 'and ', die.value);
                
                    const diceListItem = $(`<li class="list-group-item px-md-5" id="${die.name}">`);
    
                    const rowOne = $(`<div class= "row"></div> `);
                    rowOne.append($('<h2></h2>').text(die.value));
                    diceListItem.append(rowOne)
    
                    const rowTwo = $(`<div class= "row"></div> `);
                    rowTwo.append($(`<input type="checkbox"id="cb_${die.name}">`))
                    diceListItem.append(rowTwo);
    
                    diceList.append(diceListItem);
                }
                
            });
        }
        
    });
}

const calculatePoints = function(){
    // $.ajax({ 
    //     type: 'POST',
    //     async:false,
    //     data: {},//JSON.stringify(user),
    //     contentType: 'application/json',
    //     url: '/game/calculate',						
    //     success: function(data) {
            
    //     }
        
    // });
}

const addToTempPoints = function(){

}


