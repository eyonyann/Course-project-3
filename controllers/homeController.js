const path = require('path');

exports.home = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'home.html'));
};
