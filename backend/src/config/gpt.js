const files = require('./files')
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {
    openai: new OpenAIApi(configuration),
    maxChatSize: process.env.MAX_CHAT_SIZE || 30,
    timeToDeleteConvSeconds: process.env.TIME_TO_DELETE_CONVERSATION_SECONDS || 3600
};