const fsPromises = require('fs').promises;
const path = require('path');

const fileOps = async () => {
  try {
    const data = await fsPromises.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8');
    console.log(data);
    await fsPromises.writeFile(path.join(__dirname, 'files', 'promiseWrite.txt'), data);
    await fsPromises.appendFile(path.join(__dirname, 'files', 'promiseWrite.txt'), '\n\nNice to meet you.');
    await fsPromises.rename(path.join(__dirname, 'files', 'promiseWrite.txt'), path.join(__dirname, 'files', 'promiseComplete.txt'));
    const newData = await fsPromises.readFile(path.join(__dirname, 'files', 'promiseComplete.txt'), 'utf8');
    console.log(newData);

  } catch (err) {
    console.error(err);
  }
}

fileOps();


//Read file and Console.log Hello happen at the same time, but read file takes longer.
//Adding the encoding as utf8 so that we acquire data in text form. Could instead use parse.string for data.
//path.join to create the path to the file rather than write it in text. This way it works no matter the operating system.
/*
fs.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
})
*/

/*
fs.writeFile(path.join(__dirname, 'files', 'reply.txt'), 'Nice to Meet you!', (err) => {
  if (err) throw err;
  console.log('Write Complete');

  fs.appendFile(path.join(__dirname, 'files', 'reply.txt'), '\n\nYes it Is!', (err) => {
    if (err) throw err;
    console.log('Append Complete');

    fs.rename(path.join(__dirname, 'files', 'reply.txt'), path.join(__dirname, 'files', 'newReply.txt'), (err) => {
      if (err) throw err;
      console.log('Rename Complete');
    })
  })
})
*/



// exit on uncaught errors
process.on('uncaughtException', err => {
  console.error('There was an uncaught error: ${err}`')
  process.exit(1);
})