const fs = require('fs')
const path = require('path')
const express = require('express')
const { apiRoutes, collections } = require('../config/gcloud')
const { getClosestWordIndex } = require('../config/spellingFixer')

const router = express.Router()

router.use(apiRoutes.chat, express.json());

router.post(apiRoutes.chat, async (req, res) => {
    const message = req.body.message;
    
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    messageWords = message.split(' ').map(word => word.toLowerCase());

    try {
        const dbSnapshot = await collections.promptEngineering.get();
    } catch (error) {
        console.error("Error fetching prompt engineering data:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    const promptEngineeringData = {
        keys: [ ],
        contexts: [ ]
    }

    dbSnapshot.docs.map((doc, i) => {
        const keyWords = doc.keyWords || [];
        const context = doc.context || "";
        keyWords.forEach(word => {
            promptEngineeringData.keys.push({ key: word.toLowerCase(), contextBinding: i });
        });
        promptEngineeringData.contexts.push(context);
    });

    const contextList = [];

    for (const word of messageWords) {

        const index = getClosestWordIndex(promptEngineeringData.keys, word);
        if (index !== null) {
            contextList.push(promptEngineeringData.contexts[promptEngineeringData.keys[index].contextBinding]);
        }
    }

    let responseMessage = fs.readFileSync(path.join(__dirname, '../../docs/promptStarter.txt'), 'utf8');

    for (const context of contextList) {
        responseMessage += `\n- ${context}`;
    }
    responseMessage += `\nUser Question: ${message}\nAnswer:`;

    

    // TODO: For Testing
    // res.status(200).json({ reply: `You said: ${message}` });

});



module.exports = router