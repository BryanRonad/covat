var express = require("express");
var router = express.Router();
var admin = require("firebase-admin");
var serviceAccount = require("../covat-3bd0b-firebase-adminsdk-e2vx0-5106130756.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://covat-3bd0b-default-rtdb.asia-southeast1.firebasedatabase.app",
});
var db = admin.database();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/insert", (req, res) => {
  console.log(req.body);
  const recordToPush = req.body;
  recordToPush.datetime = new Date().toLocaleString();
  db.ref("records").push(recordToPush);
  res.status(200).send("Attendance record added.");
});

router.post("/status", (req, res) => {
  const { rno } = req.body;
  const ref = db.ref();
  const query = ref.orderByChild("rno").equalTo(rno);
  query.once("value", (snapshot) => {
    snapshot.forEach((userSnapshot) => {
      let value = !userSnapshot.val().status;
      console.log(value);
      db.ref(`/${userSnapshot.key}/`).update({ status: value });
    });
  });
  // var query = db.ref("/").orderByChild("rno").equalTo(rno);
  // query.on("value", function (snapshot) {
  //   snapshot.ref.update({ status: true });
  //   console.log(snapshot);
  // });
  res.status(200).send(`Status flipped for user ${rno}`);
});

module.exports = router;
