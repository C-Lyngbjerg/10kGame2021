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

const rollButton = $('#roll_button');
const bankButton = $('#bank_button');
const readyButton = $('#ready_button');

// -------------------------- DOCUMENT READY --------------------------
$(document).ready(async () => {
    // On load retrieves user information from /game/get-user from session information
    await getUser();

    // hides the ready button until used in endturn();
    readyButton.hide();

    // Sets name of player to actual player username
    updateDisplay();

    // get initial diceRolls
    getDiceRolls();
});

/*  -------------------------- ROLL_BUTTON -------------------------- 
    On click for roll button
*/
$('#roll_button').click(async function () {
    // 1. Populate chosenDice Array
    turnInfo.chosenDice = chosenDiceFromCheckBoxes();

    // 2. Calculate points for chosen dice and add to temporary points
    await getPointsCalculation();

    // 3. Retrieve new dice rolls from game.js
    validDiceArray = [];
    getDiceRolls();
});

/* -------------------------- BANK_BUTTON -------------------------- 
NOTE: add getPointsCalculation(); to bank button so you dont choose, roll and then bank.
Should be choose and then bank or roll.
*/
$('#bank_button').click(async () =>  {
    // 1. Populate chosenDice Array
    turnInfo.chosenDice = chosenDiceFromCheckBoxes();

    // 2. Calculate points for chosen dice and add to temporary points
    await getPointsCalculation();

    // 3. Changes UI to inactive, handles temp points and starts AI turn from game.js
    endTurn(true);
});

/* -------------------------- BANK_BUTTON --------------------------
 */
$('#ready_button').click(function () {

    beginNewTurn();
});
/* -------------------------- FUNCTIONS -------------------------- 
    - Functions that are mostly just a call to a router are at the top of this segment 
    and follow the naming convention 'get<noun>()'.
    - Regular functions below that segment and can contain calls to routers, but have most of the logic within play.js.
*/

// ------------ GET FUNCTIONS ------------
// TODO: fix ajax style to match calculatePoints()
function getDiceRolls() {
    $.ajax({
        method: 'POST',
        data: JSON.stringify({ turnInfo }), 
        headers: { 'Content-type': 'application/json' },
        url: '/game/get-dice-rolls',
        success: function (data) {
            diceList.empty();
            if (checkValuesRolled(data)) {
                // Truthy if values rolled contain >= 1 valid choice
                diceArray = data.map((die) => {
                    if (die.value !== -1) {
                        // -1 means disregard die
                        return populateDiceList(die, diceList);
                    } else {
                        return die;
                    }
                });
            } else {
                endTurn(false);
            }
        },
    });
}

async function getPointsCalculation() {
    await $.ajax({
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

// ------------ REGULAR FUNCTIONS ------------
function chosenDiceFromCheckBoxes() {
    tempArray = [];
    validDiceArray.map((die) => {
        if ($('#cb_' + die.name).is(':checked')) {
            tempArray.push(die.value); // NOTE: returns just the number value
        }
    });
    console.log('chosenDiceFromCheckBoxes', tempArray);
    validDiceArray = [];
    return tempArray;
}

// NOTE: WIP
// trying to make it general to both in- and voluntary ending of turns
function endTurn(voluntary) {
    console.log('endturn: ', turnInfo);
    const voluntaryBoolean = voluntary;
    const endTurnMessage = '. \nEnding turn. \nAI is now rolling. \nPress ready for next turn';
    //  check if voluntary end of turn - if truthy: move points from temp to banked
    if (voluntaryBoolean) {
        user.bankPoints += user.tempPoints;
        user.tempPoints = 0;
        status_message.text('You have banked your points' + endTurnMessage);
    } else {
        // if false: reset temp points (bad roll)
        status_message.text('No valid dice rolled' + endTurnMessage);
        user.tempPoints = 0;
    }

    // clears front-end and disables buttons while AI turn in running
    diceList.empty();
    updateDisplay();
    rollButton.prop('disabled', true);
    bankButton.prop('disabled', true);

    $.ajax({
        method: 'POST',
        url: '/game/end-turn',
        headers: { 'Content-type': 'application/json' },
        data: JSON.stringify({ turnInfo }),
        success: function (data) {
            // updates AI score and shows ready button
            turnInfo = data.turnInfo;
            turnInfo.diceLeft = 6;
            turnInfo.diceChosen = [];
            updateDisplay();
            readyButton.show();
        },
    });
}

function beginNewTurn() {
    status_message.text('Your turn');
    readyButton.hide();
    console.log('beginNewTurn: ', turnInfo);
    getDiceRolls();
    rollButton.prop('disabled', false);
    bankButton.prop('disabled', false);
}

// Fills the diceList <ul> in play.html - is called in map function to populate full list
function populateDiceList(die, diceList) {
    const diceListItem = $(`<li class="list-group-item px-md-5 border-0" id="${die.name}">`);

    const rowOne = $(`<div class= "row"></div> `);
    rowOne.append($(`<i class="fas fa-dice-${diceIconArray[die.value]} fa-3x"></i>`));
    diceListItem.append(rowOne);
 
    const rowTwo = $(`<div class= "row justify-content-center"></div> `);
    rowTwo.append($(`<input type= "checkbox" id="cb_${die.name}">`));
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



// updates the displayed names and points values
function updateDisplay() {
    titleName.text(user.u_name + ' is playing vs AI');

    tempName.text(user.u_name + ': ' + user.tempPoints);
    bankName.text(user.u_name + ': ' + user.bankPoints);
    aiTempName.text('AI: ' + turnInfo.aiTempPoints);
    aiBankName.text('AI: ' + turnInfo.aiBankPoints);
}

