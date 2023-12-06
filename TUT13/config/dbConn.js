const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, { 
            // process.env.DATABASE_URI Doesn't work?? .env connection wrong??
            // Have to use the path itself. . .
        });
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB;