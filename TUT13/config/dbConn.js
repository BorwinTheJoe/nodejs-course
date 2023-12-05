const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://mongotut:testing123@cluster0.irmtae7.mongodb.net/?retryWrites=true&w=majority", { 
            // process.env.DATABASE_URI Doesn't work?? .env connection wrong??
            // Have to use the path itself. . .
        });
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB;