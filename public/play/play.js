// -------- game elements --------
let user;
let diceArray = [];
let validDiceArray = [];
const diceIconArray = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];

let userTempPoints = 0;
let aiTempPoints = 0;
let userBankPoints = 0;
let aiBankPoints = 0;

// -------- HTML elements as consts --------
const titleName = $('#title_name');
const tempName = $('#temp_name');
const bankName = $('#bank_name');
const status_message = $('#status_message');

// -------------------------- DOCUMENT READY --------------------------
$(document).ready(function () {
    // On load change name of player to actual player username
    getUser();

    titleName.text(user.user + ' is playing vs AI');
    tempName.text(user.user + ': ' + userTempPoints);
    bankName.text(user.user + ': ' + userBankPoints);

    // get initial diceRolls
    getDiceRolls();
});

/*  -------------------------- ROLL_BUTTON -------------------------- 
    On click for roll button
    Which has to do the following in order:
    1. check chosen dice and calculate points 
    2. add to temporary points
    3. roll new dice
*/
$('#roll_button').click(function () {
    // 1. Calculate points for chosen dice
    calculatePoints(chosenDice);

    // 2. Add to the temporary points total
    addToTempPoints();

    // 3. Retrieve new dice rolls from game.js
    getDiceRolls();
});

/* -------------------------- BANK_BUTTON -------------------------- 
    On click for bank button
    1. get points from temporary points
    2. add to banked points
    3. clear temporary points
    4. end turn
*/
$('#bank_button').click(function () {});

/* -------------------------- FUNCTIONS -------------------------- 
    
*/

function getDiceRolls() {
    $.ajax({
        type: 'POST',
        async: false,
        data: {}, //JSON.stringify(user),
        contentType: 'application/json',
        url: '/game/get-dice-rolls',
        success: function (data) {
            console.log('success', data);
            const diceList = $('#dice_list');
            diceList.empty();
            if (checkValuesRolled(data)) {
                // Truthy if values rolled contain >= 1 valid choice
                diceArray = data.map((die) => {
                    if (die.value !== -1) {
                        // -1 means disregard die
                        return populateDiceList(die, diceList);
                    }
                });
            } else {
                noValidChoiceFound();
                // TODO: endTurn();
                // NOTE: show or nah the dice even though turn ends?
            }
            console.log(diceArray);
        },
    });
}

// NOTE: empty function
function calculatePoints(chosenDice) {
    $.ajax({
        type: 'POST',
        async: false,
        data: { chosenDice }, //JSON.stringify(user),
        contentType: 'application/json',
        url: '/game/calculate',
        success: function (data) {
            // add to temp points
        },
    });
}

// NOTE: empty function
function addToTempPoints() {}

function endTurn() {}

// NOTE: should call endTurn(); when ready
function noValidChoiceFound() {
    status_message.text('No valid choice rolled. Your turn has ended');
    // TODO: Call endTurn();
}

// Fills the diceList <ul> in play.html - is called in map function to populate full list
function populateDiceList(die, diceList) {
    const diceListItem = $(`<li class="list-group-item px-md-5" id="${die.name}">`);

    const rowOne = $(`<div class= "row"></div> `);
    // rowOne.append($('<h2></h2>').text(die.value));
    rowOne.append($(`<i class="fas fa-dice-${diceIconArray[die.value]} fa-3x"></i>`));
    diceListItem.append(rowOne);

    const rowTwo = $(`<div class= "row justify-content-center"></div> `);
    rowTwo.append($(`<input type="checkbox"id="cb_${die.name}">`));
    validDiceArray.append(die.name);
    diceListItem.append(rowTwo);

    diceList.append(diceListItem);
    return die;
}

// returns true if any viable dice combination has been rolled eg 1, 5 or 3 of a kind
// NOTE: check if way to do variable with parameters or not worth changing
function checkValuesRolled(data) {
    let valuesCountArray = [0, 0, 0, 0, 0, 0, 0];
    data.map((die) => {
        valuesCountArray[die.value] = valuesCountArray[die.value] + 1;
    });
    if (valuesCountArray.includes(3) || valuesCountArray[1] >= 1 || valuesCountArray[5] >= 1) {
        return true;
    } else {
        return false;
    }
}

// requests and then populates the user constant with req.session info from /auth/
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
