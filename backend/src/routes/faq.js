const express = require('express');
const { getAuth, hashPassword } = require('../auth/auth');
const { path, fs } = require('../config/files');
const HttpError = require('../config/error');

const router = express.Router();

router.use('/', express.json());

async function getFAQData() {
    try {
        const faqPath = path.join(__dirname, '../../docs/faq.json');
        const faqContent = await fs.promises.readFile(faqPath, 'utf8');
        return JSON.parse(faqContent);
    } catch (error) {
        console.error('Error fetching FAQ data:', error);
        return [];
    }
}

async function saveFAQData(faqData) {
    const faqPath = path.join(__dirname, '../../docs/faq.json');
    await fs.promises.writeFile(faqPath, JSON.stringify(faqData, null, 2));
}

// TODO: Unit Test
async function saveFAQData(faqData) {
    const faqPath = path.join(__dirname, '../../docs/faq.json');
    await fs.promises.writeFile(faqPath, JSON.stringify(faqData, null, 2));
}


async function Authenticate(authHeader, { question, answer } = {}) {
    
    if (!authHeader) {
        throw new HttpError('Unauthorized', 401);
    }

    if (question !== undefined && !question) {
        throw new HttpError('Question is required', 400);
    }

    if (answer !== undefined && !answer) {
        throw new HttpError('Answer is required', 400);
    }

    const [scheme, token] = authHeader.split(' ');

    if (!scheme || !token || scheme !== 'Basic') {
        throw new HttpError('Unauthorized', 401);
    }

    const [username, password] = Buffer.from(token, 'base64').toString('utf8').split(':');

    // Hash the input password
    const hashedInput = hashPassword(password);

    // Compare username and hash
    const authData = await getAuth();
    if (username !== authData.username || hashedInput !== authData.password) {
        throw new HttpError('Forbidden', 403);
    }
}

// TODO: Unit Test
router.post('/', async (req, res) => {

    const authHeader = req.headers['authorization'];

    try {
        await Authenticate(authHeader, { question: req.body.question, answer: req.body.answer });
    } catch (error) {
        return res.status(error.statusCode || 401).json({ error: error.message });
    }

    // Update the faq JSON file
    const faqData = await getFAQData();

    // Finding duplicates
    if (faqData.some(element => element.question === req.body.question)) {
        return res.status(409).json({ error: 'FAQ with this question already exists' });
    }

    faqData.push(req.body);
    await saveFAQData(faqData);

    // If authentication is successful, proceed with the request
    res.status(200).json({ message: 'FAQ submitted successfully' });
});


// TODO: Unit Test
router.delete('/', async (req, res) => {

    const authHeader = req.headers['authorization'];

    // Authenticate the user
    try {
        await Authenticate(authHeader, { question: req.body.question });
    } catch (error) {
        return res.status(error.statusCode || 401).json({ error: error.message });
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