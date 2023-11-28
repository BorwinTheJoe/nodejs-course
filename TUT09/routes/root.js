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

router.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, "..", 'views', 'new-page.html'));
});

router.get('/old-page(.html)?', (req, res) => {
    // 302 code redirect by default. we want a 301. which is a permanent re-dir.
    res.redirect(301, '/new-page.html'); 
});

module.exports = router