const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const secret = 'Fullstack';

router.post('/', async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split(' ')[1]
        var decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        res.json({ status: 'ok', decoded });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
})

module.exports = router;