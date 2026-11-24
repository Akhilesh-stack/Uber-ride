const mongoose = require('mongoose');

function connectToDb() {
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI is not set. Add it to Backend/.env');
        return;
    }
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Connected to DB'))
        .catch(err => console.error('DB connection error:', err.message));
}

module.exports = connectToDb;
