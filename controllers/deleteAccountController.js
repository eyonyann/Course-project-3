const path = require('path');
const User = require('../models/User');
const Rating = require("../models/Rating");
const Review = require("../models/Review");


exports.deleteAccount = async (req, res) => {
    try {
        await Rating.destroy({
            where: { userId: req.session.user.id }
        });

        await Review.destroy({
            where: { userId: req.session.user.id }
        });
        await User.destroy({ where: { id: req.session.user.id } });
        // Очищаем сессию
        req.session.destroy();
        res.status(200).json({ message: 'Аккаунт успешно удален' });
    } catch (error) {
        console.error('Failed to delete account:', error);
        res.status(500).json({ error: 'Ошибка удаления аккаунта' });
    }
};