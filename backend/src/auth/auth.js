const files = require('../config/files');
const crypto = require('crypto')

const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

const auth = {
    username: process.env.AUTH_USERNAME,
    password: hashPassword(process.env.AUTH_PASSWORD)
};

module.exports = { auth, hashPassword };