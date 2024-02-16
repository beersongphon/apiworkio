const express = require('express');
const router = express.Router();
const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017/";
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secret = 'Fullstack';
require('dotenv').config()

const dbName = 'dbworkio';

router.post('/', async (req, res) => {
  const client = new MongoClient(url);
  await client.connect();
  const dbo = client.db(dbName);
  const user = await dbo.collection('tb_user').findOne({ "email": req.body.email });
  await client.close()
  bcrypt.compare(req.body.password, user.password, function (err, isLogin) {
    if (isLogin) {
      var payload = { userid: user.id, fullname: user.fname + " " + user.lname, email: user.email };
      var access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h', algorithm: "HS256" });
      var refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d', algorithm: "HS256" })
      // refreshTokens.push(refreshToken)
      // res
      //   .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
      //   .header('Authorization', accessToken)
      // .send(user)
      res.json({ status: 'ok', message: 'Login success', token: { access_token, refresh_token } });
    } else {
      res.json({ status: 'error', message: 'Login failed' });
    }
  })
})

module.exports = router;