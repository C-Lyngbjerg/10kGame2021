const router = require('express').Router();

let turnInfo = {};
let user = {};
let diceLeft = 6;
let diceRolls = [
    {
        name: 1,
        value: -1,
    },
    {
        name: 2,
        value: -1,
    },
    {
        name: 3,
        value: -1,
    },
    {
        name: 4,
        value: -1,
    },
    {
        name: 5,
        value: -1,
    },
    {
        name: 6,
        value: -1,
    },
];
let diceChosen = [
    {
        name: 1,
        count: 0,
        multiplier: 1000,
    },
    {
        name: 2,
        count: 0,
        multiplier: 100,
    },
    {
        name: 3,
        count: 0,
        multiplier: 100,
    },
    {
        name: 4,
        count: 0,
        multiplier: 100,
    },
    {
        name: 5,
        count: 0,
        multiplier: 100,
    },
    {
        name: 6,
        count: 0,
        multiplier: 100,
    },
];
router.post('/game/get-dice-rolls', (req, res) => {
    rollDice(turnInfo.diceLeft); // rolls the new dice
    res.send(diceRolls);
});

router.post('/game/calculate', (req, res) => {
    turnInfo = req.body.turnInfo;
    user = req.body.user;

    console.log('calculate turninfo: ',turnInfo);
    user.tempPoints += calculatePoints(turnInfo.chosenDice); // calculates the points and returns score
    console.log('calculate user : ',user);
    res.send({ turnInfo:turnInfo, user: user});
});

// TODO: endturn() reset diceLeft
// NOTE: here or in play.js?
// here but some functionality in play.js
router.post('/game/end-turn', (req, res) => {
    const points = req.body.points;
    if (points == 0) {
    }
});

// NOTE: needs input validation
function calculatePoints(data) {
    let score = 0;
    console.log(data);

    // simpleDie represents the number value of each die chosen
    // is used to increase the count value which is used in the next .map function to calculate the points
    data.map((simpleDie) => {
        if (simpleDie !== 0) {
            let indexOfCurrentDie = diceChosen.findIndex((i) => i.name === simpleDie);
            diceChosen[indexOfCurrentDie].count += 1;
        }
    });

    // diceChosen contains for each die: name (number), count of occurences in current roll
    // and multiplier for the die.
    diceChosen.map((die) => {
        if (die.count !== 0) {
            if (die.name === 1 && die.count < 3) {
                score += die.count * 100;
            } else if (die.name === 5 && die.count < 3) {
                score += die.count * 50;
            } else {
                score += die.name * die.multiplier;
            }
            console.log(score);
        }
    });
    
    // remove # dice left equal to count of dice chosen
    turnInfo.diceLeft -= data.length;

    // if all dice are used, then reset diceLeft to 6
    if (turnInfo.diceLeft === 0) {
        turnInfo.diceLeft = 6;
    }

    console.log(diceChosen);

    // clears count value at the end for next call
    diceChosen.map((die) => {
        die.count = 0;
    });
    return score;
}

// function to populate diceRolls[] with random die.value between 1-6
function rollDice(diceLeft) {
    diceRolls.map((die) => {
        if (die.name > diceLeft) {
            // die.name = 'd'+die.name;
            die.value = -1;
        } else {
            // die.name = 'd'+die.name;
            die.value = getRandomInt();
        }
    });
}

function getRandomInt() {
    return Math.floor(Math.random() * 6) + 1;
}

module.exports = {
    router,
};
