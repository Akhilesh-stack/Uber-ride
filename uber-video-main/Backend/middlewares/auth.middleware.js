const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');

const getToken = (req) => req.cookies?.token || req.headers.authorization?.split(' ')[ 1 ];

const authenticate = (Model, key) => async (req, res, next) => {
    const token = getToken(req);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const isBlacklisted = await blackListTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const account = await Model.findById(decoded._id);
        if (!account) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req[ key ] = account;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports.getToken = getToken;
module.exports.authUser = authenticate(userModel, 'user');
module.exports.authCaptain = authenticate(captainModel, 'captain');
