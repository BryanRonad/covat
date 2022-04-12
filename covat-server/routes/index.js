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
  db.ref("records").set(recordToPush);
  res.status(200).send("Attendance record added.");
});

module.exports = router;
