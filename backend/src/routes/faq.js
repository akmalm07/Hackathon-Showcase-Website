const express = require('express');
const auth = require('../auth/auth');
const { path, fs } = require('../config/files');

const router = express.Router();

async function getFAQData() {
    const faqPath = path.join(__dirname, '../../docs/faq.json');
    const faqContent = await fs.readFile(faqPath, 'utf8');
    return JSON.parse(faqContent);
}

async function saveFAQData(faqData) {
    const faqPath = path.join(__dirname, '../../docs/faq.json');
    await fs.writeFile(faqPath, JSON.stringify(faqData, null, 2));
}

// TODO: Unit Test
router.post('/', async (req, res) => {

    const authHeader = req.headers['authorization'];

    // Authenticate the user
    if (!authHeader) 
        return res.status(401).json({ error: 'Unauthorized' });
    
    if (!req.body.question || !req.body.answer) {
        return res.status(400).json({ error: 'Question and answer are required' });
    }

    const [scheme, token] = authHeader.split(' ');
    
    if (!scheme || !token || scheme !== 'Basic') 
        return res.status(401).json({ error: 'Unauthorized' });

    const [username, password] = Buffer.from(token, 'base64').toString('utf8').split(':');

    // Use base64 for encoding
    if (username !== auth.username || password !== auth.password) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    // Update the faq JSON file
    const faqData = await getFAQData();
    faqData.push(req.body);
    await saveFAQData(faqData);

    // If authentication is successful, proceed with the request
    res.status(200).json({ message: 'FAQ submitted successfully' });
});


// TODO: Unit Test
router.delete('/', async (req, res) => {

    const authHeader = req.headers['authorization'];

    // Authenticate the user
    if (!authHeader) 
        return res.status(401).json({ error: 'Unauthorized' });
    
    const [scheme, token] = authHeader.split(' ');
    
    if (!scheme || !token || scheme !== 'Basic') 
        return res.status(401).json({ error: 'Unauthorized' });

    const [username, password] = Buffer.from(token, 'base64').toString('utf8').split(':');

    // Use base64 for encoding
    if (username !== auth.username || password !== auth.password) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    // Update the faq JSON file
    const faqData = await getFAQData();
    const index = faqData.findIndex(item => item.question === req.body.question);
    if (index !== -1) {
        faqData.splice(index, 1);
        await saveFAQData(faqData);
        res.status(200).json({ message: 'FAQ deleted successfully' });
    } else {
        res.status(404).json({ error: 'FAQ not found' });
    }
});

// TODO: Unit Test
router.get('/', async (req, res) => {
    const faqData = await getFAQData();
    res.status(200).json(faqData);
});

module.exports = router;