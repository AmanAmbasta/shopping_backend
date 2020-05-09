const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/connection')
const router = express.Router();

const { check, validationResult } = require('express-validator');

db.loadDatabase();
let tkn= '';

router.get('/', (req, res) => { // this is localhost:PORT/auth/
    res.json({
        message: 'AuthStarted'
    });
});

var generateRandomToken = function (length) {
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let text = '';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    console.log(`generateRandomString :${text}`);
return text;

};


router.post('/signin', [
    check('username').isEmail(),
    check('password').isLength({ min: 5 }),
    check('gender').notEmpty(),
    check('mobile').isNumeric().isLength({ min: 10 }),
    check('name').notEmpty()],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        console.log(req.body);

        db.findOne({ username: req.body.username }, function (err, doc) {
            if (doc === null) {    // If no document is found, doc is null
                bcrypt.hash(req.body.password, 8).then(hashedPassword => {

                    const user = {
                        name: req.body.name,
                        username: req.body.username,
                        password: hashedPassword,
                        mobile: req.body.mobile,
                        gender: req.body.gender,
                    };
                    db.insert(user)
                    console.log(user);
                    res.json(user);
                })
            }
            else {
                res.json({ message: "Present" });
            }
        });
    }
);

router.post('/signup', [
    check('username').isEmail(),
    check('password').isLength({ min: 5 })],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        db.findOne({ username: req.body.username }, function (err, doc) {
            if (doc === null) {
                res.json({ message: "Invalid User" });
            }
            else {
                // res.json({username: doc.username,password:doc.password})
                bcrypt.compare(req.body.password, doc.password)
                    .then(result => {
                        if (result == true) {
                            tkn = generateRandomToken(16)
                            res.json({ Status: 'Verifed', token: tkn })
                        } else {
                            res.json({ Status: 'Not-Verifed', token: null })
                        }
                    })
                // .catch(err=>{res.json(err)})
            }
        })
    });

module.exports = router;
