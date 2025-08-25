const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const authConfig = {
    username: process.env.AUTH_USERNAME,
    password: process.env.AUTH_PASSWORD
};

module.exports = authConfig;