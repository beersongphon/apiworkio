const express = require('express');
const router = express.Router();
const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017/";
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secret = 'Fullstack';

const dbName = 'dbworkio';

router.get('/', async (req, res) => {
  const id = parseInt(req.params.id);
  const client = new MongoClient(url);
  await client.connect();
  const dbo = client.db(dbName);
  const users = await dbo.collection('tb_workio').find({}).toArray();
  await client.close();
  res.status(200).send(users);
})

router.get('/:id/:title', async (req, res) => {
  const id = parseInt(req.params.id);
  const title = req.params.title;
  const client = new MongoClient(url);
  await client.connect();
  const dbo = client.db(dbName);
  const workio = await dbo.collection('tb_workio').findOne({ "userid": id, "workdate": title });
  await client.close();
  if (workio) {
    res.status(200).send({
      "status": "ok",
      "workio": workio
    });
  } else {
    res.status(200).send({
      "status": "data not found"
    });
  }
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

// router.post('/save', async function (req, res, next) {
//   const work = req.body;
//   const client = new MongoClient(url);
//   await client.connect();
//   const dbo = client.db(dbName);
//   await dbo.collection('tb_workio').insertOne({
//       // client.db('mydb').collection('users').insertOne({
//       userid: work.userid,
//       workdate: work.workdate,
//       workin: work.workin,
//       workout: work.workout
//     }).then(work => {
//       if (work) {
//         res.status(200).json({
//           status: "ok",
//           message: "Workio successfully created",
//           // user,
//         });
//       } else {
//         res.json({ status: 'error', message: err });
//       }
//     });
//     await client.close();
// });

router.post('/save', async function (req, res, next) {
  const work = req.body;
  const client = new MongoClient(url);
  await client.connect();
  const dbo = client.db(dbName);
  var query = { "fname": work.fname, "workdate": work.workdate };
  // dbo.collection('user').find(query)
  await dbo.collection('tb_workio').find(query).toArray().then(async result => {
    if (result.length > 0) {
      res.json({ message: "The name already exists" });
    } else {
      await dbo.collection('tb_workio').insertOne({
        // client.db('mydb').collection('users').insertOne({
        userid: work.userid,
        workdate: work.workdate,
        workin: work.workin,
        workout: work.workout
      }).then(work => {
        if (work) {
          res.status(200).json({
            status: "ok",
            message: "Workio successfully created",
            // user,
          });
        } else {
          res.json({ status: 'error', message: err });
        }
      });
      await client.close();
    }
  });
});


router.put('/update', async function (req, res, next) {
  const work = req.body;
  const id = parseInt(work.userid);
  const client = new MongoClient(url);
  await client.connect();
  // findOneAndUpdate
  const dbo = client.db(dbName);
  await dbo.collection('tb_workio').updateOne({ 'userid': id }, {
    "$set": {
      userid: parseInt(work.userid),
      workdate: work.workdate,
      workin: work.workin,
      workout: work.workout
    }
  }).then(work => {
    if (work) {
      res.status(200).json({
        status: "ok",
        message: "Workio successfully updated",
        // work,
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
})

router.delete('/delete', async (req, res) => {
  const id = parseInt(req.body.id);
  const client = new MongoClient(url);
  await client.connect();
  const dbo = client.db(dbName);
  await dbo.collection('tb_workio').deleteOne({ 'id': id }).then(user => {
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