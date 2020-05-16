const router = require('express').Router();
const db = require('../db/cartdb');
const tokenCheck = require('./tokenCheck');

db.loadDatabase();

router.post('/add', tokenCheck, (req, res) => {
        const date = new Date()
        const timeStamp = date.toUTCString();
        console.log(req.body);
        if (req.body.productId) {
                const data = {
                        productId: req.body.productId,
                        date: timeStamp,
                        user_id: req.user._id
                }
                db.insert(data);
                res.send(req.user._id);
        } else {
                return res.status(422).send('body is missing');
        }

})
router.get('/show', tokenCheck, (req, res) => {
        db.find({ user_id: req.user._id }, (err, doc) => {
                if (doc == null)
                        return res.status(422).send('Cart Is Empty');
                res.send(doc);
        })
})

module.exports = router;