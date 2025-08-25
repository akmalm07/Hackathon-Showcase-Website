const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });


module.exports = {
    dotenv,
    path,
    fs,
    backendUrl: process.env.BACKEND_URL || 'http://localhost:3000',
    port: process.env.PORT || 3000
};
