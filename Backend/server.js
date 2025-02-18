const http = require('http');   
const app = require('./app');
const port = process.env.PORT || 5001;

const server = http.createServer(app);

server.listen(8000,()=>{
    console.log(`Server is running on port ${port}`);
});

