const path = require('path');

exports.search = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'search.html'));
};
