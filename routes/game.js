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

router.post('/game/get-dice-rolls', (req, res) => {
    rollDice(diceLeft);
    res.send(diceRolls);
});

function getRandomInt() {
    return Math.floor(Math.random() * 6) + 1;
}

// function to populate diceRolls[] with random die.value between 1-6
const rollDice = (diceLeft) => {
    diceRolls.map((die) => {
        if (die.name > diceLeft) {
            // die.name = 'd'+die.name;
            die.value = -1;
        } else {
            // die.name = 'd'+die.name;
            die.value = getRandomInt();
        }
    });
};

module.exports = {
    router,
};
