const path = require('path');

exports.favorites = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'favorites.html'));
};
