const { getSecret } = require('../auth/auth');
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: getSecret('MBHS_DB_SECRETS', 'OPENAI_API_KEY')
});
    
module.exports = {
    openai: openai,
    maxChatSize: process.env.MAX_CHAT_SIZE || 60,
    timeToDeleteConversationSeconds: process.env.TIME_TO_DELETE_CONVERSATION_SECONDS || 3600
};