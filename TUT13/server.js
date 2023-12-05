require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require ('./middleware/errorHandler');
const verifyJWT = require ('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

const PORT = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

// Custom-made middleware logger.
app.use(logger);

// Handle options credentials check - BEFORE CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Stands for Cross Origin Resource Sharing.
app.use(cors(corsOptions));

// built-in middleware to handle url-encoded form data. 
app.use(express.urlencoded({ extended: false }));

// built-in middleware for serving json files.
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// serve static files
// (will route into public folder to search for those files)
app.use(express.static(path.join(__dirname, '/public')));

// ROUTES
// They route things based off of their directories.
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));


app.use(verifyJWT);
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

mongoose.connection.once('open', () => {
    console.log('connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
