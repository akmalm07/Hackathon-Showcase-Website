const files = require('./config/files');
const express = require('express');
const chatRoutes = require('./routes/chat');
const faqRoutes = require('./routes/faq');
const frontend = require('./routes/frontend');

const app = express();

app.use(faqRoutes);
app.use(chatRoutes);
app.use(frontend);

app.listen(files.port || 3000, () => {
    console.log(`Server is running on port ${files.port || 3000}`);
});