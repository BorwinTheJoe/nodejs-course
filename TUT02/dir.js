const fs = require('fs');
const path = require('path');

if (!fs.existsSync('./new')) {
  fs.mkdir('./new', (err) => {
    if (err) throw err;
    console.log('Directory created');
  });
}



process.on('uncaughtException', err => {
  console.error('There was an uncaught error: ${err}`')
  process.exit(1);
})