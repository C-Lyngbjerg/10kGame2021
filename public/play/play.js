// -------- game elements --------
let user = {
    u_id: 0,
    email: 'placeholder',
    u_name: 'placeholder',
    mmr: 0,
    tempPoints: 0,
    bankPoints: 0,
};

let turnInfo = {
    diceLeft: 6,
    chosenDice: [],
    aiTempPoints: 0,
    aiBankPoints: 0,
};

let diceArray = [];
let validDiceArray = [];
const diceIconArray = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];

// -------- HTML elements as consts --------
const titleName = $('#title_name');
const tempName = $('#temp_name');
const bankName = $('#bank_name');
const aiTempName = $('#ai_temp_name');
const aiBankName = $('#ai_bank_name');
const status_message = $('#status_message');
const diceList = $('#dice_list');

// -------------------------- DOCUMENT READY --------------------------
$(document).ready(async () => {
    // On load retrieves user information from /game/get-user from session information
    await getUser();
    // Sets name of player to actual player username
    updateDisplay();

    // get initial diceRolls
    getDiceRolls();
});

/*  -------------------------- ROLL_BUTTON -------------------------- 
    On click for roll button
*/
$('#roll_button').click(function () {
    // 1. Populate chosenDice Array
    turnInfo.chosenDice = chosenDiceFromCheckBoxes();

    // 2. Calculate points for chosen dice and add to temporary points
    getPointsCalculation();

    // 3. Retrieve new dice rolls from game.js
    validDiceArray = [];
    getDiceRolls();
});

/* -------------------------- BANK_BUTTON -------------------------- 
    On click for bank button
    1. get points from temporary points
    2. add to banked points
    3. clear temporary points
    4. end turn
*/
$('#bank_button').click(function () {
    // Add to banked points
    user.bankPoints += user.tempPoints;
    
    // clear temporary points
    user.tempPoints = 0;
    updateDisplay();

    // temporary fix until 
    status_message.text('You have banked your points. \nEnding Turn');
    // call endturn method with truthy voluntary 
    // endTurn(true);
});

/* -------------------------- FUNCTIONS -------------------------- */

function chosenDiceFromCheckBoxes() {
    tempArray = validDiceArray
        .map((die) => {
            if ($('#cb_' + die.name).is(':checked')) {
                return die.value; // NOTE: returns just the number value
            } else {
                return null;
            }
        })
        .filter((die) => die !== null);
    return tempArray;
}

// TODO: fix ajax style to match calculatePoints()
function getDiceRolls() {
    $.ajax({
        method: 'POST',
        data: {}, //JSON.stringify(user),
        headers: { 'Content-type': 'application/json' },
        url: '/game/get-dice-rolls',
        success: function (data) {
            console.log('getDiceRolls data : ', data);

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
                endTurn(false);
                // NOTE: show or nah the dice even though turn ends?
            }
            console.log('getDiceRolls diceArray: ', diceArray);
        },
    });
}

function getPointsCalculation() {
    $.ajax({
        method: 'POST',
        url: '/game/calculate',
        headers: { 'Content-type': 'application/json' },
        data: JSON.stringify({ turnInfo, user }),
        success: function (data) {
            turnInfo = data.turnInfo;
            user = data.user;
            updateDisplay();
        },
    });
}

// NOTE: empty function
function addToPoints() {}

// NOTE: WIP
// trying to make it general to both in- and voluntary ending of turns
function endTurn(voluntary) {
    const points = 0;
    if (voluntary) {
        points = user.tempPoints;
        user.bankPoints += user.tempPoints;
    } else {
        user.tempPoints = 0;
    }
    $.ajax({
        method: 'POST',
        url: '/game/end-turn',
        headers: { 'Content-type': 'application/json' },
        data: JSON.stringify({ points }),
        success: function (data) {
            /* 
            TODO : 
            handle AI turn in game.js
            how to handle in- or voluntary end turn differences
             */
        },
    });
}

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
    validDiceArray.push(die);
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
                tempPoints: user.tempPoints,
                bankPoints: user.tempPoints,
            };
        },
    });
}

// updates the displayed names and points values
function updateDisplay() {
    titleName.text(user.u_name + ' is playing vs AI');
    tempName.text(user.u_name + ': ' + user.tempPoints);
    bankName.text(user.u_name + ': ' + user.bankPoints);
    aiTempName.text('AI : ' + turnInfo.aiTempPoints);
    aiBankName.text('AI : ' + turnInfo.aiBankPoints);
}
