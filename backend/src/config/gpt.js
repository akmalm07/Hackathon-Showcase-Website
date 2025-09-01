const { getSecret } = require('../auth/auth');
const OpenAI = require("openai");

let openai;

async function getOpenAIClient() {
    if (!openai) {
        const apiKey = await getSecret('MBHS_DB_SECRETS', 'OPENAI_API_KEY');
        openai = new OpenAI({ apiKey });
    }
    return openai;
}


const maxChatSize = process.env.MAX_CHAT_SIZE || 60;

const timeToDeleteConversationSeconds = process.env.TIME_TO_DELETE_CONVERSATION_SECONDS || 3600;

const openaiModel = process.env.OPENAI_MODEL || "gpt-4";

module.exports = {
    getOpenAIClient,
    openaiModel,
    maxChatSize,
    timeToDeleteConversationSeconds
};