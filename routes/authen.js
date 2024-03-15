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
        if (error.name === 'TokenExpiredError') {
            res.status(401).send({ status: 'error', message: error.message });
            // console.log('A value was used incorrectly.');
        }
         else {
            res.status(500).send({ status: 'error', message: error.message });
            // console.log('At least not a type error.');
         }
        // res.json({ status: 'error', message: error.message });
        // if (error instanceof TypeError) {
        //     // console.log('A value was used incorrectly.');
        // }
        // res.status(401).send({ status: 'error', message: error.message });
    }
})

module.exports = router;