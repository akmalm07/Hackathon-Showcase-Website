const file = require('../config/files');
const express = require('express');


const router = express.Router();

app.use(express.static(path.join(__dirname, '../frontend/build')));


router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

