const path = require('path');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getSignIn = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'signIn.html'));
};

exports.postSignIn = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username: username } });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
/*            req.session.userId = user.id;*/
            res.status(200).json({ message: 'Successfully logged in!' });
        } else {
            res.status(401).json({ error: 'Incorrect username or password!' });
        }
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
