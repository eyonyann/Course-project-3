function home(req, res) {
    res.sendFile(__dirname + '/public/html/home.html');
}

module.exports = {
    home: home
};
