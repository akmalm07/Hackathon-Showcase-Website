const { backendUrl, fs, path } = require('../config/files');
const express = require('express');
const { collections, firestoreTimestamp, firestoreAddValue } = require('../config/gcloud');
const { getClosestWordIndex } = require('../config/spellingFixer');
const { openai, timeToDeleteConversationSeconds, maxChatSize } =  require('../config/gpt');

const router = express.Router()

async function checkIfNotExceedLimits(chatId, chatHistory = []) {
    
    if (chatHistory.length <= maxChatSize) {
        return true;
    }

    const result = await fetch(`${backendUrl}/chat`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: chatId }),
    });

    const data = await result.json();

    if (data.error === 'Chat history not found' && data.status === 404) {
        console.error('Error deleting chat history:', data.error || 'Unknown error');
        throw new Error('Chat history not found');
    }

    if (!result.ok) {
        console.error('Error deleting chat history:', data.error || 'Unknown error');
        throw new Error('Failed to delete chat history');
    }

    return false;

}

async function sendMessageToChatGPT(res, chatId, message = "", contextList = [], chatHistory = []) {

    let response;

    try {
        // Build system context
        const contextStr = (contextList.length > 0 ? contextList.join("\n") : null);


        // Validate inputs before hitting the API
        try {
            const validation = await checkIfNotExceedLimits(chatId, chatHistory);

            if (!validation) {
                return res.status(400).json({ error: 'Chat history exceeded maximum size and has been reset. Please refresh your screen.' });
            }

        } catch (error) {
            console.error('Error validating chat history:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Build messages array
        const messages = [];

        if (contextStr) {
            messages.push({ role: "system", content: contextStr });
        }

        if (Array.isArray(chatHistory) && chatHistory.length > 0) {
            chatHistory.forEach(entry => {
                if (entry.user) {
                    
                    messages.push({ role: "user", content: entry.user });
                }
                if (entry.assistant) {
                    messages.push({ role: "assistant", content: entry.assistant });
                }
            });
        }

        messages.push({ role: "user", content: message  });

        // Call OpenAI
        response = await openai.chat.completions.create({
            model: "gpt-4",
            messages
        });

    } catch (err) {
        console.error("Error in sendMessageToChatGPT:", err);
        res.status(500).json({ error: 'Internal Server Error', details: err });
        return;
    }
    return response.choices[0]?.message?.content ?? "";
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
        contextBindings: [ ],
        contexts: [ ]
    }

    dbRef.docs.forEach((doc, i) => {
        const data = doc.data();
        const keyWords = data.keyWords || [];
        const context = data.context || '';

        keyWords.forEach(word => {
            promptEngineeringData.keys.push(word.toLowerCase());
            promptEngineeringData.contextBindings.push(i);

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
            contextList.push(promptEngineeringData.contexts[promptEngineeringData.contextBindings[index]]);
        }
    }

    return contextList;
}

router.use('/', express.json());


router.post('/', async (req, res) => { 

    const message = req.body.message;
    
    if (!message || message.trim() === "") {
        return res.status(400).json({ error: 'Message is required' });
    }

    let chatId = req.body.chatId;

    let response = "";
    let doc;

    if (!chatId) {
        try {
            doc = collections.chatHistory.doc();
            await doc.set({
                createdAt: firestoreTimestamp.fromDate( new Date()),
                expireAt: firestoreTimestamp.fromDate(new Date(Date.now() + timeToDeleteConversationSeconds * 1000)),
                messages: []
            });
        } catch (error) {
            console.error('Error adding chat history:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const contextList = await getAppropriateContext(res, message);

        chatId = doc.id;

        response = await sendMessageToChatGPT(res, chatId, message, contextList, []);
    } else {

        let docRef;
        try {
            doc = collections.chatHistory.doc(chatId);
            docRef = await doc.get();
        } catch (error) {
            console.error('Error fetching chat history:', error);
            return res.status(500).json({ error: 'Error fetching chat history' });
        }

        if (!docRef.exists) {
            return res.status(400).json({ error: 'Your chat history has been expired. Please start a new conversation.' });
        }

        const chatHistory = docRef.data().messages || [];
        const contextList = await getAppropriateContext(res, message);

        response = await sendMessageToChatGPT(res, chatId, message, contextList, chatHistory);

    }
    
    try {
        await doc.update({
            messages: firestoreAddValue.arrayUnion({ user: message, assistant: response })
        });
    } catch (error) {
        console.error('Error updating chat history:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

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