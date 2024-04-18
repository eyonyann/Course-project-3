class Admin extends User {
    constructor(username, password, adminName) {
        super(username, password);
        this._adminName = adminName;
    }

    get adminName() {
        return this._adminName;
    }

    set adminName(newAdminName) {
        this._adminName = newAdminName;
    }
}