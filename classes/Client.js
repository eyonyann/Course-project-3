class Client extends User {
    constructor(username, password, clientName) {
        super(username, password);
        this._clientName = clientName;
    }

    get clientName() {
        return this._clientName;
    }

    set clientName(newClientName) {
        this._clientName = newClientName;
    }
}