const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    
    const routes = {
        '/': 'Welcome to the API',
        '/api': { message: 'API endpoint' },
        '/health': { status: 'healthy' }
    };

    const path = routes[req.url] || '404 Not Found';
    res.end(JSON.stringify(path));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
