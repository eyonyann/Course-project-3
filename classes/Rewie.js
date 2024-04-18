class Review {
    constructor(movieID, clientID, review) {
        this._movieID = movieID;
        this._clientID = clientID;
        this._review = review;
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

    get review() {
        return this._review;
    }

    set review(newReview) {
        this._review = newReview;
    }
}