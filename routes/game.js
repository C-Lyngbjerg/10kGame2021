const router = require('express').Router();

let turnInfo = {};
let user = {
    u_id: 0,
    email: 'placeholder',
    u_name: 'placeholder',
    mmr: 0,
    tempPoints: 0,
    bankPoints: 0,
};
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
    turnInfo = req.body.turnInfo;
    rollDice(turnInfo.diceLeft); // rolls the new dice
    res.send(diceRolls);
});

router.post('/game/calculate', (req, res) => {
    turnInfo = req.body.turnInfo;
    user = req.body.user;
    user.tempPoints = Number(user.tempPoints);
    if (typeof user.tempPoints !== 'number') {
        user.tempPoints == 0;
    }

    user.tempPoints += calculatePoints(turnInfo.chosenDice); // calculates the points and returns score
    console.log('diceLeft4: ',turnInfo.diceLeft);
    res.send({ turnInfo: turnInfo, user: user });
});

// TODO: endturn() reset diceLeft
router.post('/game/end-turn', (req, res) => {
    turnInfo = req.body.turnInfo;
    turnInfo.aiBankPoints += 100;
    res.send({ turnInfo: turnInfo });
});

// NOTE: needs input validation
function calculatePoints(diceForPointCalculation) {
    let score = 0;
    console.log('diceForPointCalculation: ',diceForPointCalculation);

    // simpleDie represents the number value of each die chosen
    // is used to increase the count value which is used in the next .map function to calculate the points
    diceForPointCalculation.map((simpleDie) => {
        if (simpleDie !== -1) {
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
            } else if (die.count === 3){
                score += die.name * die.multiplier;
            } else if (die.count > 3){
                score += (die.name * die.multiplier) * ((die.count-3)*2);
            }
            console.log('score: ',score);
        }
    });
    console.log('diceLeft: ',turnInfo.diceLeft);
    // remove # dice left equal to count of dice chosen
    turnInfo.diceLeft -= diceForPointCalculation.length;
    console.log('diceLeft2: ',turnInfo.diceLeft);

    // if all dice are used, then reset diceLeft to 6
    if (turnInfo.diceLeft === 0) {
        turnInfo.diceLeft = 6;
    }
    console.log('diceLeft3: ',turnInfo.diceLeft);

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
            die.value = -1;
        } else {
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
