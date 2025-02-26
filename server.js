const express = require('express');
const app = express();
const port = 443;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// For local testing without HTTPS
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

