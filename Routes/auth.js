const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db/connection')
const tokenCheck = require('./tokenCheck');

const router = express.Router();

const { check, validationResult } = require('express-validator');
//loading DataBase
User.loadDatabase();

// POST Request Handle For Registation
router.post('/signin', [
    check('username').isEmail(),
    check('password').isLength({ min: 5 }),
    check('gender').notEmpty(),
    check('mobile').isNumeric().isLength({ min: 10 }),
    check('name').notEmpty()],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors)
            return res.status(422).json({ errors: errors.array() });
        }

        // LOOKING in USER'S DB FOR THE REQUESTED DATA
        User.findOne({ username: req.body.username }, function (err, user) {
            if (user === null) {
                bcrypt.hash(req.body.password, 8)
                    .then(hashedPassword => {
                        // Creatig Schema For DataBase 
                        const user = {
                            name: req.body.name,
                            username: req.body.username,
                            password: hashedPassword,
                            mobile: req.body.mobile,
                            gender: req.body.gender,
                        };
                        User.insert(user);
                        res.json({ status: 'Done', message: 'New User Created' });
                    })
            }
            else {
                res.json({ status: 'Error', message: 'User Already Exist' });
            }
        });
    }
);

// POST Request handle For LOGIN or SIGNUP
router.post('/signup', [
    check('username').isEmail(),
    check('password').isLength({ min: 5 })],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        // LOOKING in USER'S DB FOR THE REQUESTED DATA
        User.findOne({ username: req.body.username }, async (err, user) => {
            if (user === null)
                return res.status(400).send('NO User Found');

            // Verify Password 
            const verifyPass = await bcrypt.compare(req.body.password, user.password);
            if (!verifyPass)
                return res.status(400).send('INVALID PASSWORD');

            // Creating TOKEN
            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_KEY);
            res.header('auth-token', token).send(user._id);

        });
    }
);
module.exports = router;
