const express = require('express');
const prdb = require('../db/productAttributes')
const router = express.Router();

prdb.loadDatabase();

router.post('/add',
    (req, res) => {

        prdb.findOne({ "productBaseInfo.productId": req.body.productBaseInfo.productId }, (err, doc) => {
            if (doc === null) {
                let data = {
                    productBaseInfo: {
                        productId: req.body.productBaseInfo.productId,
                        category: req.body.productBaseInfo.category
                    },
                    productAttributes: {
                        title: req.body.productAttributes.title,
                        productDescription: req.body.productAttributes.productDescription,
                        imageUrls: req.body.productAttributes.imageUrls,
                        productBrand: req.body.productAttributes.productBrand
                    },
                    Price: {
                        maximumRetailAmount: req.body.Price.maximumRetailAmount,
                        sellingPriceAmount: req.body.Price.sellingPriceAmount,
                        discountPercentage: req.body.Price.discountPercentage,
                        currency: req.body.Price.currency
                    }
                }
                prdb.insert(data);
                res.json({  status: 'Done',message: "ADDED TO DATABASE" });
            }
            else {
                res.json({ status: 'Error', message: "Product is already in database" });
            }
        })
    }
);
router.get('/all', (req, res) => {
    prdb.find({}, (err, doc) => {
        res.send({data: doc});
    })
})

module.exports = router;