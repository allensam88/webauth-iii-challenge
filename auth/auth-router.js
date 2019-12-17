const bcrypt = require('bcryptjs');

const router = require('express').Router();

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
    let user = req.body;

    // hash the password
    const hash = bcrypt.hashSync(user.password, 8); // the 8 is the number or round (2^8) iterations  

    // override the plaintext password with the hash
    user.password = hash


    Users.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                res.status(200).json({ message: `${user.username} is now logged in.` });
            } else {
                res.status(401).json({ message: 'You shall not pass!' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if (err) {
            res.json({ message: 'you can checkout any time, but you can never leave'})
            } else {
                res.status(200).json({ message: 'bye, thanks for playing!' })
            }
        });
    } else {
        res.status(200).json({ message: 'You were never here to begin with' })
    }
});

module.exports = router;