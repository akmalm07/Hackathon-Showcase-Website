const { backendUrl, fs, path } = require('../config/files');
const express = require('express');
const { collections, firestoreTimestamp } = require('../config/gcloud');
const { getClosestWordIndex } = require('../config/spellingFixer');
const { openai, timeToDeleteConversationSeconds, maxChatSize } =  require('../config/gpt');

const router = express.Router()

async function checkIfNotExceedLimits(res, chatId, message, chatHistory) {

    if (chatHistory.length <= maxChatSize) {
        chatHistory.push({ user: message, assistant: null });
    } else {
        const result = await fetch(`${backendUrl}/chat`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatId: chatId }),
        });

        const data = await result.json();

        if (data.error === 'Chat history not found' && data.status === 404) {
            console.error('Error deleting chat history:', data.error || 'Unknown error');
            res.status(404).json({ error: 'Chat history not found' });
        }

        if (!result.ok) {
            console.error('Error deleting chat history:', data.error || 'Unknown error');
            res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(400).json({ error: 'Chat history exceeded maximum size and has been reset. Please refresh your screen.' });        
    }
}

async function sendMessageToChatGPT(res, chatId, message, contextList, chatHistory) {

    let contextStr = '';
    contextList.forEach(context => {
        contextStr += context + '\n';
    } );
    await checkIfNotExceedLimits(res, chatId, message, chatHistory);

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            { role: 'system', content: contextStr },
            ...chatHistory.flatMap(entry => [ 
                { role: 'user', content: entry.user }, 
                { role: 'assistant', content: entry.assistant }
            ]),
            { role: 'user', content: message }
        ]
    });

    return response.choices[0].message.content;
}

async function getAppropriateContext(res, message) {
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const messageWords = message.split(' ').map(word => word.toLowerCase());

    let dbRef;
    try {
        dbRef = await collections.promptEngineering.get();
    } catch (error) {
        console.error('Error fetching prompt engineering data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    const promptEngineeringData = {
        keys: [ ],
        contexts: [ ]
    }

    dbRef.docs.map((doc, i) => {
        const keyWords = doc.keyWords || [];
        const context = doc.context || '';
        keyWords.forEach(word => {
            promptEngineeringData.keys.push({ key: word.toLowerCase(), contextBinding: i });
        });
        promptEngineeringData.contexts.push(context);
    });

    const contextList = [];

    try {
        contextList.push(fs.readFileSync(path.join(__dirname, '../../docs/promptStarter.txt'), 'utf8'));
    } catch (error) {
        console.error('Error reading prompt starter file:', error);
        res.status(500).json({ error: 'Error reading prompt starter file:', details: error });
    }

    for (const word of messageWords) {

        const index = getClosestWordIndex(promptEngineeringData.keys, word);
        if (index !== null) {
            contextList.push(promptEngineeringData.contexts[promptEngineeringData.keys[index].contextBinding]);
        }
    }

    return contextList;
}

router.use('/chat', express.json());


router.post('/chat', async (req, res) => { // DEBUGGING

    const message = req.body.message;
    let chatId = req.body.chatId;

    if (!chatId) {
        let docRef;
        try {
            docRef = await collections.chatHistory.add({
                createdAt: firestoreTimestamp.fromDate( new Date()),
                expiresAt: firestoreTimestamp.fromDate(new Date(Date.now() + timeToDeleteConversationSeconds * 1000)),
                messages: []
            });
        } catch (error) {
            console.error('Error adding chat history:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const contextList = await getAppropriateContext(res, message);

        chatId = docRef.id;

        const response = await sendMessageToChatGPT(res, chatId, message, contextList, []);

        res.status(200).json({ reply: response, chatId: chatId });
        return;
    }

    let docRef;
    try {
        docRef = await collections.chatHistory.doc(chatId).get();
    } catch (error) {
        console.error('Error fetching chat history:', error);
        return res.status(500).json({ error: 'Error fetching chat history' });
    }

    if (!docRef.exists) {
        return res.status(400).json({ error: 'Your chat history has been expired. Please start a new conversation.' });
    }

    const chatHistory = docRef.data().messages || [];
    const contextList = await getAppropriateContext(res, message);

    const response = await sendMessageToChatGPT(res, chatId, message, contextList, chatHistory);

    res.status(200).json({ reply: response, chatId: chatId });
});


router.delete('/', async (req, res) => {
    const chatId = req.body.chatId;

    if (!chatId) {
        return res.status(404).json({ error: 'Chat ID is required' });
    }

    try {
        await collections.chatHistory.doc(chatId).delete();
        res.status(200).json({ message: 'Chat history deleted successfully' });
    } catch (error) {
        console.error('Error deleting chat history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router