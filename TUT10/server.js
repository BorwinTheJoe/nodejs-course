const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require ('./middleware/errorHandler');
const PORT = process.env.PORT || 8080;

// Custom-made middleware logger.
app.use(logger);

// Stands for Cross Origin Resource Sharing.
app.use(cors(corsOptions));

// built-in middleware to handle url-encoded form data. 
app.use(express.urlencoded({ extended: false }));

// built-in middleware for serving json files.
app.use(express.json());

// serve static files
// (will route into public folder to search for those files)
app.use(express.static(path.join(__dirname, '/public')));

//Those are our Routes. They route things based off of their directories.
app.use('/', require('./routes/root'));
app.use('/employees', require('./routes/api/employees'));

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