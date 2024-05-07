const path = require('path');
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getSignUp = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'signUp.html'));
};

exports.postSignUp = async (req, res) => {
    const { name, username, password } = req.body;
    const nameRegex = /^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{10,}$/;

    try {
        const existingUser = await User.findOne({ where: { username: username } });
        if (existingUser) {
            res.status(401).json({ error: 'Username должен быть уникальным.' });
        } else if (!nameRegex.test(name)) {
            res.status(401).json({ error: 'ФИО на русском должно быть, каждое слово с большой буквы.' });
        } else if (!usernameRegex.test(username)) {
            res.status(401).json({ error: 'Username должен состоять только из английских символов и цифр.' });
        } else if (!passwordRegex.test(password)) {
            res.status(401).json({ error: 'Пароль должен содержать минимум 10 символов.' });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                username: username,
                name: name,
                password: hashedPassword
            });
            req.session.user = newUser;
/*            req.session.userId = newUser.id;*/
            res.status(200).json({ message: 'Пользователь зарегистрирован!' });
        }
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ error: 'Не удалось зарегистрировать пользователя.' });
    }
};
