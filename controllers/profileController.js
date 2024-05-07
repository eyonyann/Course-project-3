const path = require('path');
const User = require('../models/User');
const bcrypt = require('bcrypt');


exports.getProfile = async (req, res) => {
    try {
/*        const username = req.session.userId;*/
        const user = await User.findOne({ where: { id: req.session.user.id } });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render(path.join(__dirname, '..', 'public', 'html', 'profile.ejs'), {
            name: user.name,
            username: user.username
        });
    } catch (error) {
        console.error('Failed to load profile:', error);
        res.status(500).send('Internal server error');
    }
};

exports.postProfile = async (req, res) => {
    console.log(req.body);
    const { name, username, oldPassword, newPassword } = req.body;
/*    console.log(req.session.user);*/
    const currentUser = await User.findOne({ where: { id: req.session.user.id } });
    console.log(User);

    if (!currentUser) {
        return res.status(404).json({ error: 'Пользователь не найден.' });
    }

    let updates = {};

    if (username && username !== currentUser.username) {
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!usernameRegex.test(username)) {
            return res.status(401).json({ error: 'Username должен состоять только из английских символов и цифр.' });
        }
        const existingUser = await User.findOne({ where: { username } });
        console.log(existingUser);
        if (existingUser && existingUser.id !== currentUser.id) {
            return res.status(401).json({ error: 'Username должен быть уникальным.' });
        }
        updates.username = username;
/*        req.session.user = updates.username;
        console.log(req.session.user);*/
    }

    if (name && name !== currentUser.name) {
        const nameRegex = /^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/;
        if (!nameRegex.test(name)) {
            return res.status(401).json({ error: 'ФИО должно быть на русском, каждое слово с большой буквы.' });
        }
        updates.name = name;
    }

    if (newPassword) {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{10,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(401).json({ error: 'Новый пароль должен содержать минимум 10 символов.' });
        }
        const isOldPasswordValid = await bcrypt.compare(oldPassword, currentUser.password);
        if (!isOldPasswordValid || !oldPassword) {
            return res.status(401).json({ error: 'Старый пароль неверный.' });
        }
        updates.password = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updates).length > 0) {
        try {
            // Логируем, что именно мы обновляем
            console.log("Applying updates:", updates);

            // Применяем обновления
            await User.update(updates, { where: { id: currentUser.id } });
            req.session.user = await User.findOne({ where: { id: req.session.user.id } });
            res.status(200).json({ message: 'Профиль успешно обновлен!' });
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ error: 'Ошибка сохранения данных.' });
        }
    } else {
        res.status(200).json({ message: 'Нет изменений для обновления.' });
    }
};