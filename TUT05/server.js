const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./logEvents');
const EventEmitter = require('events');
class Emitter extends EventEmitter {};
// initialize object
const myEmitter = new Emitter();
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));
const PORT = process.env.PORT || 8080;

// function to serve files. Requires the filePath of the file and the contentType of said file.
// Requires the response object to serve the file to the request.
const serveFile = async (filePath, contentType, response) => {
    // Using fs promises to perform actions in order.
    try {
        const rawData = await fsPromises.readFile(filePath,
            //if the content type doesn't contain image, serve in utf8. otherwise, leave as is.
             !contentType.includes('image') ? 'utf8' : ''
        );
        const data = contentType === 'application/json'
            //if the content type is json, parse the data with JSON.parse. Otherwise, serve raw data.
            ? JSON.parse(rawData) : rawData;
        response.writeHead(
            //if the filepath is to the error 404 page, make the code 404. otherwise, send code 200.
            filePath.includes('404.html')? 404 : 200, 
            {'Content-Type': contentType}
        );
        response.end(
            //if the content type is json, send stringified data. otherwise, send data as normal.
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (err) {
        // send the error in the console.
        console.log(err);
        // emit Event logger event, to log the error in the errLog.txt. 
        myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }
} 

// Creating the http server with request and response parameters.
const server = http.createServer((req, res) =>{
    // console log informing us of the requested url and the method used.
    // Current server only handles the GET method.
    console.log(req.url, req.method);
    // Event emitter for Event logger for Errors and requests.
    myEmitter.emit('log', `${req.url}\t${req.method}\n`, 'reqLog.txt');
    // Pulling the url provided in the request to determine the contentType.
    // Might be able to place path.extname(req.url) instead of extension in case.
    // Would remove an unnecessary variable/constant.
    const extension = path.extname(req.url);
    // variable to save the contentType string for later use.
    let contentType;
    // assessing contentType of the request for file path creation.
    // Also needed for serving the correct type of data on request.
    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default: 
            contentType = 'text/html';
    }
    // creates the filePath depending on it's structure depending on if it's an html file type or not.
    // if file is just a forward dash, make the filepath TUT05/views/index.html.
    // else, if the last symbol is forward dash, Also make the filepath TUT05/views/index.html
    // else, make the filepath TUT05/views/(request's_url)
    // if it's NOT contentType of text/html, make the filepath TUT05/(request's_url) 
    let filePath = 
        contentType === 'text/html' && req.url === '/'
        ? path.join(__dirname, 'views', 'index.html')
        : contentType === 'text/html' && req.url.slice(-1) === '/'
            ? path.join(__dirname, 'views', req.url, 'index.html')
            : contentType === 'text/html'
                ? path.join(__dirname, 'views', req.url)
                : path.join(__dirname, req.url);

    // makes .html extension not required.
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';
    // check if the filepath exists.
    // Could replace fileExists in if statement and remove need for a new const. variable.
    const fileExists = fs.existsSync(filePath);
    if (fileExists) {
        // Serve the File using the serveFile Function.
        serveFile(filePath, contentType, res);
    } else {
        // Error 404 or
        // 301 Redirect
        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, {'Location': '/new-page.html'});
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, {'Location': '/'});
                res.end();
                break;
            default:
                // serve a 404 response - send to the error 404 page.
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
                break;
        }
    }
});
// make the server listen for requests.
server.listen(PORT, () => {console.log(`Server running on port ${PORT}`)});