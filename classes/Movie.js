class Movie {
    constructor(title, director, country, year, description, rating) {
        this._title = title;
        this._director = director;
        this._country = country;
        this._year = year;
        this._description = description;
        this._rating = rating;
    }

    get title() {
        return this._title;
    }

    set title(newTitle) {
        this._title = newTitle;
    }

    get director() {
        return this._director;
    }

    set director(value) {
        this._director = value;
    }

    get country() {
        return this._country;
    }

    set country(value) {
        this._country = value;
    }

    get year() {
        return this._year;
    }

    set year(value) {
        this._year = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get rating() {
        return this._rating;
    }

    set rating(value) {
        this._rating = value;
    }
}