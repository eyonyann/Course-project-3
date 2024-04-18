const bcrypt = require('bcrypt');
const User = require('../models/User');


function signUpGet(req, res) {
    res.sendFile(__dirname + '/public/html/signUp.html');
}
async function signUpPost(req, res) {
    const { name, username, password } = req.body;
    const nameRegex = /^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{10,}$/;

    try {
        // Проверяем, существует ли пользователь с таким же именем пользователя (username)
        const existingUser = await User.findOne({ where: { username: username } });

        if (existingUser) {
            // Если пользователь существует, возвращаем ошибку
            res.status(401).json({ error: 'Username должен быть уникальным.' });
        } else if (!nameRegex.test(name)) {
            // Если ФИО не соответствует регулярному выражению, возвращаем ошибку
            res.status(401).json({ error: 'ФИО на русском должно быть, каждое слово с большой буквы.' });
        } else if (!usernameRegex.test(username)) {
            // Если имя пользователя не соответствует регулярному выражению, возвращаем ошибку
            res.status(401).json({ error: 'Username должен состоять только из английских символов и цифр.' });
        } else if (!passwordRegex.test(password)) {
            // Если пароль не соответствует регулярному выражению, возвращаем ошибку
            res.status(401).json({ error: 'Пароль должен содержать минимум 10 символов.' });
        } else {
            // Если все проверки прошли успешно, хэшируем пароль
            const hashedPassword = await bcrypt.hash(password, 10);

            // Создаем нового пользователя в базе данных
            const newUser = await User.create({
                username: username,
                password: hashedPassword
            });

            // Устанавливаем сессию пользователя
            req.session.user = newUser.id; // Можно сохранить ID пользователя в сессии
            res.status(200).json({ message: 'Пользователь зарегистрирован!' });
        }
    } catch (error) {
        // Если произошла ошибка при сохранении пользователя в базу данных, возвращаем ошибку сервера
        console.error('Error signing up:', error);
        res.status(500).json({ error: 'Не удалось зарегистрировать пользователя.' });
    }
}

module.exports = {signUpGet, signUpPost};