const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });


module.exports = {
    dotenv,
    path,
    fs,
    port: process.env.PORT || 8080
};
