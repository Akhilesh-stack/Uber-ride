const mongoose = require('mongoose');

async function connectToDb() {
    if (!process.env.DB_CONNECT) {
        throw new Error('DB_CONNECT is not set in environment');
    }
    await mongoose.connect(process.env.DB_CONNECT);
    console.log('Connected to DB');
}

module.exports = connectToDb;
