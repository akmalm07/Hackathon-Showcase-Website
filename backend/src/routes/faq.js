const { apiRoutes } = require('../config/gcloud');
const express = require('express');
const auth = require('../auth/auth');
const path = require('path');
const fs = require('fs');

const router = express.Router();

function getFAQData() {
    const faqPath = path.join(__dirname, '../../docs/faq.json');
    const faq = JSON.parse(fs.readFileSync(faqPath, 'utf8'));
    return faq;
}


// TODO: Unit Test
router.post(apiRoutes.faq, (req, res) => {

    // Authenticate the user
    const authHeader = req.headers.authorization;

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Basic' || !token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const [username, password] = Buffer.from(token, 'base64').toString('utf8').split(':');

    // Use base64 for encoding
    if (username !== auth.username || password !== auth.password) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    // Update the faq JSON file
    const faqData = getFAQData();
    faqData.push(req.body);
    fs.writeFileSync(faqPath, JSON.stringify(faqData, null, 2)); // Push changes to save in the JSON file

    // If authentication is successful, proceed with the request
    res.status(200).json({ message: 'FAQ submitted successfully' });
});


// TODO: Unit Test
router.delete(apiRoutes.faq, (req, res) => {

    // Authenticate the user
    const authHeader = req.headers.authorization;

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Basic' || !token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const [username, password] = Buffer.from(token, 'base64').toString('utf8').split(':');

    // Use base64 for encoding
    if (username !== auth.username || password !== auth.password) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    // Update the faq JSON file
    const faqData = getFAQData();
    const index = faqData.findIndex(item => item.question === req.body.question);
    if (index !== -1) {
        faqData.splice(index, 1);
        fs.writeFileSync(faqPath, JSON.stringify(faqData, null, 2)); // Push changes to save in the JSON file
        res.status(200).json({ message: 'FAQ deleted successfully' });
    } else {
        res.status(404).json({ error: 'FAQ not found' });
    }
});

// TODO: Unit Test
router.get(apiRoutes.faq, (req, res) => {
    res.status(200).json(getFAQData());
});

module.exports = router;