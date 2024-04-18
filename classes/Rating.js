class Rating {
    constructor(movieID, clientID, rating) {
        this._movieID = movieID;
        this._clientID = clientID;
        this._rating = rating;
    }

    get movieID() {
        return this._movieID;
    }

    set movieID(newMovieID) {
        this._movieID = newMovieID;
    }

    get clientID() {
        return this._clientID;
    }

    set clientID(newClientID) {
        this._clientID = newClientID;
    }

    get rating() {
        return this._rating;
    }

    set rating(newRating) {
        this._rating = newRating;
    }
}