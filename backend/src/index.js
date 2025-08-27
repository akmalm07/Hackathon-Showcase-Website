const files = require('./config/files');
const express = require('express');
const chatRoutes = require('./routes/chat');
const faqRoutes = require('./routes/faq');
const frontend = require('./routes/frontend');
const { apiRoutes } = require('./config/gcloud');

const cors = require("cors");

const app = express();

app.use(cors());

console.log("Im 5:", apiRoutes);
app.use(apiRoutes.frontend, frontend);
console.log("Im 6:", apiRoutes);

console.log("Im 7:", apiRoutes);
app.use(apiRoutes.faq, faqRoutes);
console.log("Im 8:", apiRoutes);


console.log("Im 9:", apiRoutes);
app.use(apiRoutes.chat, chatRoutes);
console.log("Im 10:", apiRoutes);

console.log("Im 11:", apiRoutes);
console.log("Im 12:", apiRoutes);




app.listen(files.port || 3000, () => {
    console.log(`Server is running on port ${files.port || 3000}`);
});
