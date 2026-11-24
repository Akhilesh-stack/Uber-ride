const userModel = require('../models/user.model');
const userService = require('../services/user.service');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports.registerUser = async (req, res, next) => {
    try {
        const { fullname = {}, email, password } = req.body;

        if (!fullname.firstname || fullname.firstname.length < 3) {
            return res.status(400).json({ message: 'First name must be at least 3 characters long' });
        }
        if (!email || !EMAIL_RE.test(email)) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        if (await userModel.findOne({ email })) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await userModel.hashPassword(password);
        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword,
        });

        const token = user.generateAuthToken();
        res.status(201).json({ token, user: { _id: user._id, fullname: user.fullname, email: user.email } });
    } catch (err) {
        next(err);
    }
};

module.exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await userModel.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();
        res.status(200).json({ token, user: { _id: user._id, fullname: user.fullname, email: user.email } });
    } catch (err) {
        next(err);
    }
};
