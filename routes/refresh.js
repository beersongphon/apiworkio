const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const secret = 'Fullstack';
require('dotenv').config()

router.post('/', async (req, res, next) => {
  try {
    const refreshToken = req.headers.authorization.split(' ')[1]
    // jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    //   console.log(user);
    //   // if (err) return res.sendStatus(403)
    //   // if (err) return res.status(403).json({
    //   //   status: "error",
    //   //   message: "Forbidden"
    //   // })
    //   const accessToken = jwt.sign({ userid: user.id, fullname: user.fullname, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h', algorithm: "HS256" })
    //   res.json({ status: 'ok', accessToken: accessToken })
    // })
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign({ userid: decoded.id, fullname: decoded.fullname, email: decoded.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h', algorithm: "HS256" })
    res.json({ status: 'ok', accessToken: accessToken });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
})

module.exports = router;