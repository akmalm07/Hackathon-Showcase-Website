const { path } = require('../config/files');
const express = require('express');


const router = express.Router();

router.use(express.static(path.join(__dirname, '../..', 'frontend/build')));

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../..', 'frontend/build', 'index.html'));
});

module.exports = router;