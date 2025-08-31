const { files, dotenv } = require('../config/files');
const crypto = require('crypto')
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');


const secretManager = new SecretManagerServiceClient();


const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

const getSecret = async (secretName, key) => {
    const [version] = await secretManager.accessSecretVersion({
        name: `projects/${process.env.GCP_PROJECT_ID}/secrets/${secretName}/versions/latest`,
    });

    const payload = version.payload.data.toString('utf8');
    const parsed = JSON.parse(payload);

    return key ? parsed[key] : parsed;
};

const auth = {
    username: await getSecret('MBHS_DB_SECRETS', 'AUTH_USERNAME'),
    password: hashPassword(await getSecret('MBHS_DB_SECRETS', 'AUTH_PASSWORD'))
};


module.exports = { auth, hashPassword, getSecret };