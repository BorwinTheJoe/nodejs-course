const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require ('./middleware/errorHandler');
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
app.use('/subdir', express.static(path.join(__dirname, '/public')));

//Routes any subdirectory request to the routes subdir.
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));


// app.use('/'); DOES NOT USE REGEX!!
// using * means that ANYTHING that gets here gets the 404.html
app.all('*', (req, res) => {
    // we add status(404) because it's supposed to be our error 404 status code.
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found"});
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));