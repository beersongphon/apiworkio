const express = require('express');
const router = express.Router();
const { MongoClient } = require("mongodb");
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secret = 'Fullstack';
require('dotenv').config();

const url = process.env.ATLAS_URI;
const dbName = 'dbworkio';

router.get('/', async (req, res) => {
  const id = parseInt(req.params.id);
  const client = new MongoClient(url);
  await client.connect();
  const dbo = client.db(dbName);
  const users = await dbo.collection('tb_user').find({}).toArray();
  await client.close();
  res.status(200).send(users);
})

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const client = new MongoClient(url);
  await client.connect();
  const dbo = client.db(dbName);
  const user = await dbo.collection('tb_user').findOne({ "id": id });
  await client.close();
  res.status(200).send({
    "status": "ok",
    "user": user
  });
})

// router.post('/create', function (req, res, next) {
//   const user = req.body;
//   const client = new MongoClient(url);

//   bcrypt.hash(user.password, saltRounds, async function (err, hash) {
//       await client.connect();
//       // client.connect();
//       const dbo = client.db(dbName);
//       await dbo.collection('user').insertOne({
//           // client.db('mydb').collection('users').insertOne({
//           id: parseInt(user.id),
//           fname: user.fname,
//           lname: user.lname,
//           username: user.username,
//           email: user.email,
//           password: hash,
//           avatar: user.avatar
//       }).then(user => {
//           if (user) {
//               res.status(200).json({
//                   status: "ok",
//                   message: "User successfully created",
//                   // user,
//               })
//           } else {
//               res.json({ status: 'error', message: err });
//           }
//       })
//       await client.close();

//       // res.status(200).send({
//       //     "status": "ok",
//       //     "message": "User with ID = " + user.id + " is created",
//       //     "user": user
//       // });
//   });
// })

router.post('/create', async function (req, res, next) {
  const user = req.body;
  const client = new MongoClient(url);
  await client.connect();
  const dbo = client.db(dbName);
  var query = { "fname": user.fname };
  // dbo.collection('user').find(query)
  await dbo.collection('tb_user').find(query).toArray().then(result => {
    if (result.length > 0) {
      res.json({ message: "The name already exists" });
    } else {
      bcrypt.hash(user.password, saltRounds, async function (err, hash) {
        await dbo.collection('tb_user').insertOne({
          // client.db('mydb').collection('users').insertOne({
          id: parseInt(user.id),
          fname: user.fname,
          lname: user.lname,
          username: user.username,
          email: user.email,
          password: hash,
          avatar: user.avatar
        }).then(user => {
          if (user) {
            res.status(200).json({
              status: "ok",
              message: "User successfully created",
              // user,
            });
          } else {
            res.json({ status: 'error', message: err });
          }
        });
        await client.close();
      })
    }
  });
});

router.put('/update', function (req, res, next) {
  const user = req.body;
  const id = parseInt(user.id);
  const client = new MongoClient(url);
  bcrypt.hash(user.password, saltRounds, async function (err, hash) {
    await client.connect();
    // findOneAndUpdate
    const dbo = client.db(dbName);
    await dbo.collection('tb_user').updateOne({ 'id': id }, {
      "$set": {
        id: parseInt(user.id),
        fname: user.fname,
        lname: user.lname,
        username: user.username,
        email: user.email,
        password: hash,
        avatar: user.avatar
      }
    }).then(user => {
      if (user) {
        res.status(200).json({
          status: "ok",
          message: "User successfully updated",
          // user,
        })
      } else {
        res.json({ status: 'error', message: err });
      }
    });
    await client.close();
    // res.status(200).send({
    //     "status": "ok",
    //     "message": "User with ID = " + id + " is updated",
    //     "user": user
    // });
  });
})

router.delete('/delete', async (req, res) => {
  const id = parseInt(req.body.id);
  const client = new MongoClient(url);
  await client.connect();
  const dbo = client.db(dbName);
  await dbo.collection('tb_user').deleteOne({ 'id': id }).then(user => {
    if (user) {
      res.status(200).json({
        status: "ok",
        message: "User successfully deleted",
        // user,
      })
    } else {
      res.json({ status: 'error', message: err });
    }
  });
  await client.close();
  // res.status(200).send({
  //     "status": "ok",
  //     "message": "User with ID = " + id + " is deleted"
  // });
})

module.exports = router;