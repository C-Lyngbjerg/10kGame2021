const router = require('express').Router();

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
    rollDice(diceLeft); // rolls the new dice
    res.send(diceRolls);
});

router.post('/game/calculate', (req, res) => {
    const chosenDicePoints = req.body.chosenDice;
    console.log(chosenDicePoints);
    const score = calculatePoints(chosenDicePoints); // calculates the points and returns score
    console.log(score);
    res.send({ score });
});

// TODO: endturn() reset diceLeft
// NOTE: here or in play.js?

// NOTE: needs input validation
function calculatePoints(data) {
    let score = 0;
    console.log(data);
    data.map((simpleDie) => {
        if (simpleDie !== 0) {
            let indexOfCurrentDie = diceChosen.findIndex((i) => i.name === simpleDie);
            diceChosen[indexOfCurrentDie].count += 1;
        }
    });

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
    diceLeft -= data.length;
    if (diceLeft === 0) {
        diceLeft = 6;
    }
    console.log(diceChosen);
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
