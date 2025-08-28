const files = require('./config/files');
const express = require('express');
const chatRoutes = require('./routes/chat');
const faqRoutes = require('./routes/faq');
const frontend = require('./routes/frontend');
const { apiRoutes } = require('./config/gcloud');

const cors = require("cors");

const app = express();

app.use(cors());

app.use(apiRoutes.frontend, frontend);

app.use(apiRoutes.faq, faqRoutes);


app.use(apiRoutes.chat, chatRoutes);

app.listen(files.port || 3000, () => {
    console.log(`Server is running on port ${files.port || 3000}`);
});
