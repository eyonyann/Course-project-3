exports.postLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to destroy session:', err);
            res.status(500).json({ error: 'Failed to log out' });
        } else {
            // Возвращаем успешный ответ
            res.status(200).json({ message: 'Logged out successfully' });
        }
    });
};
