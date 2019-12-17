const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('./users-model.js');
const restricted = require('../api/restricted-middleware.js')

router.get('/', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    let changes = req.body;
    const hash = bcrypt.hashSync(changes.password, 8);
    changes.password = hash
    Users.findById(id)
        .then(user => {
            if (user) {
                Users.update(changes, id)
                    .then(updatedUser => {
                        res.status(202).json(updatedUser);
                    });
            } else {
                res.status(404).json({ message: 'Could not find user with given id.' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to update user.' });
        });
})

module.exports = router;