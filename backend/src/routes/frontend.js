const { path } = require('../config/files');
const express = require('express');


const router = express.Router();

console.log("Im 1:");
router.use("/", express.static(path.join(__dirname, '../..', 'frontend/build')));
console.log("Im 2:");


console.log("Im 3:");
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../..', 'frontend/build', 'index.html'));
});
console.log("Im 4:");

module.exports = router;