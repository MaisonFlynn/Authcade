const Wordle = require('../Models/Wordle');
const User = require('../Models/User');

// Get Word
exports.snag = async (req, res) => {
    try {
        const today = new Date().setHours(0, 0, 0, 0);
        let word = await Wordle.findOne({ date: today });

        if (!word) {
            return res.status(404).json({ error: 'NO Word Today (╥﹏╥)' });
        }

        res.json({ word: word.word });
    } catch (err) {
        console.error('Snag Error', err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Gander UPON Guess
exports.gander = async (req, res) => {
    try {
        const user = req.user;
        const today = new Date().setHours(0, 0, 0, 0);
        const word = await Wordle.findOne({ date: today });

        if (!word) {
            return res.status(404).json({ error: 'NO Word Today (╥﹏╥)' });
        }

        if (user.played && user.played.getTime() === today && user.solved) {
            return res.status(403).json({ error: 'Solved!' });
        } else if (user.played && user.played.getTime() === today) {
            return res.status(403).json({ error: 'Played!' });
        }

        const guess = req.body.guess.toLowerCase();

        if (guess.length !== 5) {
            return res.status(400).json({ error: 'NOT Big Enough ಠ‿↼' });
        }

        let result = [];
        let yessir = true;

        for (let i = 0; i < 5; i++) {
            if (guess[i] === word.word[i]) {
                result.push({ letter: guess[i], status: 'correct' }); // Correct Letter & Position
            } else if (word.word.includes(guess[i])) {
                result.push({ letter: guess[i], status: 'present' }); // Correct Letter, Wrong Position
                yessir = false;
            } else {
                result.push({ letter: guess[i], status: 'abscent' }); // Incorrect Letter
                yessir = false;
            }
        }

        // Update User's Played & Solved
        user.played = today;

        if (yessir) {
            user.coins += 5; // Increment User's Coin(s)
            user.solved = true;
        } else {
            user.solved = false;
        }

        await user.save();

        res.json({ result });

    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
        console.log(err);
    }
};