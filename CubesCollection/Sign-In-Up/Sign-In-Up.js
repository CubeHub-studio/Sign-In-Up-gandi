class SignInUp {
    constructor() {
        // =========================
        // API SETTINGS
        // =========================

        this._apiUrl = "https://sign-in-up-api.inakuu69.workers.dev";

        // =========================
        // ACCOUNT DATA
        // =========================

        this._token = "";
        this._username = "";
        this._userId = "";

        this._loggedIn = false;

        // =========================
        // ACCOUNT STATUS
        // =========================

        this._banned = false;
        this._accountStatus = "unknown";
        this._banReason = "";

        // =========================
        // LAST REQUEST
        // =========================

        this._lastResponse = "";
        this._lastError = "";
        this._lastStatus = 0;

        // =========================
        // SEARCH
        // =========================

        this._searchResults = "";
    }

    // =========================================================
    // EXTENSION INFO
    // =========================================================

    getInfo() {
        return {
            id: "signInUp",

            name: "Sign-In-Up",

            color1: "#4C97FF",
            color2: "#3373CC",
            color3: "#2855A6",

            blocks: [

                // =========================
                // API
                // =========================

                {
                    opcode: "setAPI",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Set API URL to [URL]",
                    arguments: {
                        URL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue:
                                "https://sign-in-up-api.inakuu69.workers.dev"
                        }
                    }
                },

                {
                    opcode: "getAPI",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "API URL"
                },

                // =========================
                // SIGN UP
                // =========================

                {
                    opcode: "signup",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Sign Up username [USERNAME] password [PASSWORD]",
                    arguments: {
                        USERNAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "username"
                        },

                        PASSWORD: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "password"
                        }
                    }
                },

                // =========================
                // LOGIN
                // =========================

                {
                    opcode: "login",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Log In username [USERNAME] password [PASSWORD]",
                    arguments: {
                        USERNAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "username"
                        },

                        PASSWORD: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "password"
                        }
                    }
                },

                // =========================
                // LOGOUT
                // =========================

                {
                    opcode: "logout",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Log Out"
                },

                // =========================
                // ACCOUNT
                // =========================

                {
                    opcode: "username",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "Username"
                },

                {
                    opcode: "userId",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "User ID"
                },

                {
                    opcode: "loggedIn",
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: "Logged In?"
                },

                // =========================
                // SEARCH USERS
                // =========================

                {
                    opcode: "searchUsers",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Search Users [QUERY]",
                    arguments: {
                        QUERY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "username"
                        }
                    }
                },

                {
                    opcode: "searchResults",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "Search Results"
                },

                // =========================
                // ACCOUNT STATUS
                // =========================

                {
                    opcode: "checkBan",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Check Ban Status"
                },

                {
                    opcode: "banned",
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: "Banned?"
                },

                {
                    opcode: "accountStatus",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "Account Status"
                },

                {
                    opcode: "banReason",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "Ban Reason"
                },

                // =========================
                // REQUEST INFORMATION
                // =========================

                {
                    opcode: "lastResponse",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "Last Response"
                },

                {
                    opcode: "lastError",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "Last Error"
                },

                {
                    opcode: "lastStatus",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "Last HTTP Status"
                }
            ]
        };
    }

    // =========================================================
    // GENERIC REQUEST
    // =========================================================

    async request(endpoint, data = {}, authenticated = true) {

        this._lastError = "";
        this._lastStatus = 0;

        try {

            const headers = {
                "Content-Type": "application/json"
            };

            // Add login token if needed
            if (authenticated && this._token) {
                headers["Authorization"] =
                    "Bearer " + this._token;
            }

            const response = await fetch(
                this._apiUrl + endpoint,
                {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(data)
                }
            );

            this._lastStatus = response.status;

            let result;

            try {
                result = await response.json();
            } catch (error) {

                this._lastError =
                    "API returned invalid JSON.";

                return null;
            }

            this._lastResponse =
                JSON.stringify(result);

            return result;

        } catch (error) {

            this._lastError =
                error && error.message
                    ? error.message
                    : String(error);

            return null;
        }
    }

    // =========================================================
    // SET API
    // =========================================================

    setAPI(args) {

        let url = String(args.URL || "").trim();

        if (!url) {
            return;
        }

        // Remove trailing slash
        url = url.replace(/\/+$/, "");

        this._apiUrl = url;
    }

    getAPI() {
        return this._apiUrl;
    }

    // =========================================================
    // SIGN UP
    // =========================================================

    async signup(args) {

        const username =
            String(args.USERNAME || "").trim();

        const password =
            String(args.PASSWORD || "");

        if (!username || !password) {

            this._lastError =
                "Username and password are required.";

            return;
        }

        const result = await this.request(
            "/signup",
            {
                username: username,
                password: password
            },
            false
        );

        if (!result) {
            return;
        }

        if (result.success) {

            this._username =
                result.username || username;

            this._userId =
                result.userId
                    ? String(result.userId)
                    : "";

            this._loggedIn = false;

            this._banned = false;
            this._accountStatus = "active";
            this._banReason = "";

        } else {

            this._lastError =
                result.error || "Sign up failed.";
        }
    }

    // =========================================================
    // LOGIN
    // =========================================================

    async login(args) {

        const username =
            String(args.USERNAME || "").trim();

        const password =
            String(args.PASSWORD || "");

        if (!username || !password) {

            this._lastError =
                "Username and password are required.";

            return;
        }

        const result = await this.request(
            "/login",
            {
                username: username,
                password: password
            },
            false
        );

        if (!result) {
            return;
        }

        // =========================
        // BANNED ACCOUNT
        // =========================

        if (result.banned) {

            this._loggedIn = false;
            this._token = "";

            this._username = username;

            this._banned = true;

            this._accountStatus =
                result.accountStatus || "banned";

            this._banReason =
                result.reason || "";

            this._lastError =
                result.error || "Account is banned.";

            return;
        }

        // =========================
        // SUCCESS
        // =========================

        if (result.success) {

            this._token =
                result.token || "";

            this._username =
                result.username || username;

            this._userId =
                result.userId
                    ? String(result.userId)
                    : "";

            this._loggedIn =
                Boolean(this._token);

            this._banned = false;

            this._accountStatus = "active";

            this._banReason = "";

            this._lastError = "";

        } else {

            this._loggedIn = false;
            this._token = "";

            this._lastError =
                result.error || "Login failed.";
        }
    }

    // =========================================================
    // LOGOUT
    // =========================================================

    async logout() {

        if (this._token) {

            await this.request(
                "/logout",
                {},
                true
            );
        }

        this._token = "";
        this._loggedIn = false;

        this._username = "";
        this._userId = "";

        this._banned = false;
        this._accountStatus = "unknown";
        this._banReason = "";
    }

    // =========================================================
    // USERNAME
    // =========================================================

    username() {
        return this._username;
    }

    // =========================================================
    // USER ID
    // =========================================================

    userId() {
        return this._userId;
    }

    // =========================================================
    // LOGGED IN
    // =========================================================

    loggedIn() {
        return this._loggedIn;
    }

    // =========================================================
    // SEARCH USERS
    // =========================================================

    async searchUsers(args) {

        const query =
            String(args.QUERY || "").trim();

        // Empty search
        if (!query) {

            this._searchResults = "";

            return;
        }

        const result = await this.request(
            "/search-users",
            {
                query: query
            },
            false
        );

        // API failed
        if (!result) {

            this._searchResults = "";

            return;
        }

        // API returned success
        if (
            result.success &&
            Array.isArray(result.users)
        ) {

            this._searchResults =
                result.users
                    .map(user => {

                        return String(
                            user.username || ""
                        ).trim();

                    })
                    .filter(username => {

                        return username.length > 0;

                    })
                    .join(", ");

            return;
        }

        // Search failed
        this._searchResults = "";

        this._lastError =
            result.error || "User search failed.";
    }

    // =========================================================
    // SEARCH RESULTS
    // =========================================================

    searchResults() {

        return this._searchResults;
    }

    // =========================================================
    // CHECK BAN
    // =========================================================

    async checkBan() {

        if (!this._token) {

            this._banned = false;
            this._accountStatus = "not logged in";
            this._banReason = "";

            return;
        }

        const result = await this.request(
            "/user",
            {},
            true
        );

        if (!result) {
            return;
        }

        // =========================
        // BANNED
        // =========================

        if (result.banned) {

            this._banned = true;

            this._accountStatus =
                result.accountStatus || "banned";

            this._banReason =
                result.reason || "";

            this._loggedIn = false;

            return;
        }

        // =========================
        // USER DATA
        // =========================

        if (
            result.success &&
            result.user
        ) {

            const user = result.user;

            this._username =
                user.username || this._username;

            this._userId =
                user.id !== undefined
                    ? String(user.id)
                    : this._userId;

            this._banned =
                Boolean(user.banned);

            this._accountStatus =
                user.banned
                    ? "banned"
                    : "active";

            this._banReason =
                user.reason || "";

            return;
        }

        if (result.error) {

            this._lastError =
                result.error;
        }
    }

    // =========================================================
    // BANNED
    // =========================================================

    banned() {
        return this._banned;
    }

    // =========================================================
    // ACCOUNT STATUS
    // =========================================================

    accountStatus() {
        return this._accountStatus;
    }

    // =========================================================
    // BAN REASON
    // =========================================================

    banReason() {
        return this._banReason;
    }

    // =========================================================
    // LAST RESPONSE
    // =========================================================

    lastResponse() {
        return this._lastResponse;
    }

    // =========================================================
    // LAST ERROR
    // =========================================================

    lastError() {
        return this._lastError;
    }

    // =========================================================
    // LAST HTTP STATUS
    // =========================================================

    lastStatus() {
        return String(this._lastStatus);
    }
}


// =============================================================
// REGISTER EXTENSION
// =============================================================

Scratch.extensions.register(new SignInUp());
