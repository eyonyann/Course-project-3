const bcrypt = require('bcrypt');
const User = require('../models/User');


function signInGet(req, res) {
    res.sendFile(__dirname + '/public/html/home.html');
}
async function signInPost(req, res) {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username: username } });

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                req.session.user = user.username;
                req.session.userId = user.id;
                res.status(200).json({ message: 'Successfully logged in!' });
            } else {
                res.status(401).json({ error: 'Incorrect username or password!' });
            }
        } else {
            res.status(401).json({ error: 'User not found!' });
        }
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { signInPost, signInGet} ;
