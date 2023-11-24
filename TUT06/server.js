const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 8080;
// When the app.get url request is:
// ^/$ = Just the forward slash
// | = OR
// index(.html)?
// where (.html)? means .html is Optional.
app.get('^/$|/index(.html)?', (req, res) => {
    console.log(req.url, req.method);
    //res.sendFile('./views/index.html', { root: __dirname });
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res) => {
    console.log(req.url, req.method);
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (req, res) => {
    console.log(req.url, req.method);
    // 302 code redirect by default. we want a 301. which is a permanent re-dir.
    res.redirect(301, '/new-page.html'); 
});

// * is for Anything.
app.get('/*', (req, res) => {
    console.log(req.url, req.method);
    // we add status(404) because it's supposed to be our error 404 status code.
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));