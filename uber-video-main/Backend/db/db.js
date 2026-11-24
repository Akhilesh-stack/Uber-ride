const mongoose = require('mongoose');


function connectToDb() {
    mongoose.connect(process.env.MONGO_URI
    ).then(() => {
        console.log('Connected to DB');
    }).catch(err => console.log(err));
}


module.exports = connectToDb;

// PORT=5000
// MONGO_URI=mongodb+srv://akyadav961682_db_user:Akhil123@cluster0.k5nbiem.mongodb.net/uber
// JWT_SECRET=fdf8e20e0509c1a30290b32735d630ca6dc9b61720b48a5bb9dd9dba27f807c80a2e8ac7aca2e610ed0732adf654bdff4309a9e1197f1ccebe48e137b8751bb0