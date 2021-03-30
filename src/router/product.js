const express = require('express');
const router = express.Router();
const controller = require('../core/controller')
const product = require('../core/product');
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
    try {
        product.getProduct(req, res)
    }
    catch (err) {
        return res.status(500).send(controller.errorFormat(err.message));
    }
});
router.get('/search/:item', auth, async (req, res) => {
    try {
        product.searchProduct(req, res)
    }
    catch (err) {
        return res.status(500).send(controller.errorFormat(err.message));
    }
});


router.get('/history', async (req, res) => {
    try {
        product.productHistory(req, res)
    }
    catch (err) {
        return res.status(500).send(controller.errorFormat(err.message));
    }
});


module.exports = router;
