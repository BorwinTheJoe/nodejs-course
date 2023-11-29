const express = require('express');
const router = express.Router();
const path = require ('path');

// When the app.get url request is:
// ^/$ = Just the forward slash. ^ is Starts with next, $ is ends with last.
// | = OR
// index(.html)?
// where (.html)? means .html is Optional.
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, "..", 'views', 'index.html'));
});

module.exports = router