const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const PORT = process.env.PORT || 8080;

// Custom-made middleware logger.
app.use(logger);

// Stands for Cross Origin Resource Sharing.
const whitelist = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:8080'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) { // if domain exists in the whitelist or is Undefined
            callback(null, true);
        } else {
            callback (new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// built-in middleware to handle url-encoded data. 
// Like form data.
app.use(express.urlencoded({ extended: false }));
// built-in middleware for serving json files.
app.use(express.json());
// serve static files
// (will route into public folder to search for those files)
app.use(express.static(path.join(__dirname, '/public')));

// * is for Anything.
app.get('/*', (req, res, next) => {
    console.log(req.url, req.method);
    next();
});
// When the app.get url request is:
// ^/$ = Just the forward slash
// | = OR
// index(.html)?
// where (.html)? means .html is Optional.
app.get('^/$|/index(.html)?', (req, res) => {
    //res.sendFile('./views/index.html', { root: __dirname });
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (req, res) => {
    // 302 code redirect by default. we want a 301. which is a permanent re-dir.
    res.redirect(301, '/new-page.html'); 
});

// Route Handlers!

app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to load hello.html');
    next(); // Allows us to chain responses! it goes to next func in chain
}, (req, res) => {
    res.send('Hello World!');
});

const one = (req, res, next) => {
    console.log('one');
    next();
};

const two = (req, res, next) => {
    console.log('two');
    next();
};

const three = (req, res) => {
    console.log('three');
    res.send('Finished!');
};

app.get('/chain(.html)?', [one, two, three]);

app.get('/*', (req, res) => {
    // we add status(404) because it's supposed to be our error 404 status code.
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.message);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));