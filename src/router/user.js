
const express = require('express');
const router = express.Router();
const user = require('../core/user')
const validation = require('../validation/user.validation')
const controller = require('../core/controller');
const auth = require('../middleware/auth')


router.post('/login', async (req, res) => {
    try {
        let { error } = await validation.login(req.body)
        if (error) {
            return res.status(400).send(controller.errorFormat(error.message));
        }
        user.login(req, res)
    }
    catch (err) {
        return res.status(500).send(controller.errorMsgFormat(err.message));
    }
});

router.post('/forget-password', async (req, res) => {
    try {
        let { error } = await validation.forgetPassword(req.body)
        if (error) {
            return res.status(400).send(controller.errorFormat(error.message));
        }
        user.forgetPassword(req, res)
    }
    catch (err) {
        return res.status(500).send(controller.errorMsgFormat(err.message));
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        user.logout(req, res)
    }
    catch (err) {
        return res.status(500).send(controller.errorMsgFormat(err.message));
    }
});

router.get('/ledger', auth, async (req, res) => {
    try {
        user.getLedgerHistory(req, res);
    }
    catch (err) {
        return res.status(500).send(controller.errorFormat(err.message));
    }
});



module.exports = router;