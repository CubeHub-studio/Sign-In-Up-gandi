(function (Scratch) {
    "use strict";

    const API_DEFAULT =
        "https://sign-in-up-api.inakuu69.workers.dev";

    class SignInUp {
        constructor() {
            // =========================
            // API STATE
            // =========================

            this.apiUrlValue = API_DEFAULT;

            this.tokenValue = "";
            this.usernameValue = "";
            this.userIdValue = "";

            this.lastResponseValue = "";
            this.lastErrorValue = "";
            this.lastStatusValue = 0;

            // =========================
            // ACCOUNT STATE
            // =========================

            this.loggedInValue = false;
            this.bannedValue = false;
            this.accountStatusValue = "";
            this.banReasonValue = "";

            // =========================
            // BAN CHECK STATE
            // =========================

            this.lastBanCheckValue = false;
            this.lastBanReasonValue = "";

            // =========================
            // SEARCH STATE
            // =========================

            this.searchResultsValue = "[]";
        }

        getInfo() {
            return {
                id: "signInUp",
                name: "Sign-In-Up",

                color1: "#4C97FF",
                color2: "#3373CC",
                color3: "#2355A0",

                blocks: [

                    // =========================
                    // API
                    // =========================

                    {
                        opcode: "setApiUrl",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set API URL to [URL]",
                        arguments: {
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: API_DEFAULT
                            }
                        }
                    },

                    {
                        opcode: "apiUrl",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "API URL"
                    },

                    {
                        opcode: "postJson",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "POST JSON [DATA] to [URL]",
                        arguments: {
                            DATA: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "{}"
                            },
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: API_DEFAULT
                            }
                        }
                    },

                    {
                        opcode: "lastResponse",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "last API response"
                    },

                    {
                        opcode: "apiError",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "API error"
                    },

                    {
                        opcode: "apiStatus",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "API status code"
                    },

                    // =========================
                    // ACCOUNT
                    // =========================

                    {
                        opcode: "signUp",
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

                    {
                        opcode: "signIn",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Sign In username [USERNAME] password [PASSWORD]",
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

                    {
                        opcode: "signOut",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Sign Out"
                    },

                    {
                        opcode: "loggedIn",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "Logged In?"
                    },

                    {
                        opcode: "authToken",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Auth Token"
                    },

                    {
                        opcode: "getUsername",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Username"
                    },

                    {
                        opcode: "getUserId",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "User ID"
                    },

                    // =========================
                    // ACCOUNT STATUS
                    // =========================

                    {
                        opcode: "refreshUser",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Refresh user"
                    },

                    {
                        opcode: "accountStatus",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Account status"
                    },

                    {
                        opcode: "isBanned",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "Account banned?"
                    },

                    {
                        opcode: "banReason",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Ban reason"
                    },

                    // =========================
                    // ADMIN BAN SYSTEM
                    // =========================

                    {
                        opcode: "banUser",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Ban user ID [USERID] reason [REASON]",
                        arguments: {
                            USERID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            },
                            REASON: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Violation of rules"
                            }
                        }
                    },

                    {
                        opcode: "unbanUser",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Unban user ID [USERID]",
                        arguments: {
                            USERID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },

                    {
                        opcode: "checkBan",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Check ban for user ID [USERID]",
                        arguments: {
                            USERID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },

                    {
                        opcode: "banCheckResult",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "last ban check says banned?"
                    },

                    {
                        opcode: "lastBanReason",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "last ban reason"
                    },

                    // =========================
                    // USER SEARCH
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
                    // AUTHENTICATED REQUEST
                    // =========================

                    {
                        opcode: "authenticatedPost",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "POST JSON [DATA] to [URL] with token",
                        arguments: {
                            DATA: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "{}"
                            },
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: API_DEFAULT
                            }
                        }
                    }
                ]
            };
        }

        // ============================================================
        // API
        // ============================================================

        setApiUrl(args) {
            this.apiUrlValue =
                String(args.URL || "")
                    .replace(/\/+$/, "");
        }

        apiUrl() {
            return this.apiUrlValue;
        }

        async postJson(args) {
            const url =
                String(args.URL || "");

            const data =
                String(args.DATA || "{}");

            this.lastErrorValue = "";
            this.lastStatusValue = 0;

            try {
                const parsed = JSON.parse(data);

                const response = await fetch(url, {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },

                    body: JSON.stringify(parsed)
                });

                this.lastStatusValue =
                    response.status;

                const text =
                    await response.text();

                this.lastResponseValue =
                    text;

                if (!response.ok) {
                    this.lastErrorValue =
                        text;
                }

                return text;

            } catch (error) {
                this.lastErrorValue =
                    String(error);

                this.lastResponseValue =
                    "";

                return "";
            }
        }

        // ============================================================
        // SIGN UP
        // ============================================================

        async signUp(args) {
            const username =
                String(args.USERNAME || "");

            const password =
                String(args.PASSWORD || "");

            const result =
                await this.request(
                    "/signup",
                    {
                        username,
                        password
                    }
                );

            if (
                result &&
                result.success
            ) {
                this.saveSession(result);
            }
        }

        // ============================================================
        // SIGN IN
        // ============================================================

        async signIn(args) {
            const username =
                String(args.USERNAME || "");

            const password =
                String(args.PASSWORD || "");

            const result =
                await this.request(
                    "/login",
                    {
                        username,
                        password
                    }
                );

            if (
                result &&
                result.success
            ) {
                this.saveSession(result);
            }
        }

        // ============================================================
        // SAVE SESSION
        // ============================================================

        saveSession(result) {
            this.tokenValue =
                result.token || "";

            this.usernameValue =
                result.username || "";

            this.userIdValue =
                result.userId || "";

            this.loggedInValue =
                Boolean(this.tokenValue);

            this.bannedValue =
                Boolean(result.banned);

            this.accountStatusValue =
                result.accountStatus ||
                (
                    this.bannedValue
                        ? "banned"
                        : "active"
                );

            this.banReasonValue =
                result.reason || "";
        }

        // ============================================================
        // SIGN OUT
        // ============================================================

        async signOut() {
            if (this.tokenValue) {
                await this.request(
                    "/logout",
                    {},
                    true
                );
            }

            this.tokenValue = "";
            this.usernameValue = "";
            this.userIdValue = "";

            this.loggedInValue = false;
            this.bannedValue = false;
            this.accountStatusValue = "";
            this.banReasonValue = "";
        }

        loggedIn() {
            return this.loggedInValue;
        }

        authToken() {
            return this.tokenValue;
        }

        getUsername() {
            return this.usernameValue;
        }

        getUserId() {
            return this.userIdValue;
        }

        // ============================================================
        // USER STATUS
        // ============================================================

        async refreshUser() {
            if (!this.tokenValue) {
                this.loggedInValue = false;
                return;
            }

            const result =
                await this.request(
                    "/user",
                    {},
                    true,
                    "GET"
                );

            if (
                result &&
                result.success
            ) {
                this.loggedInValue = true;

                this.usernameValue =
                    result.username ||
                    this.usernameValue;

                this.userIdValue =
                    result.userId ||
                    this.userIdValue;

                this.bannedValue =
                    Boolean(result.banned);

                this.accountStatusValue =
                    result.accountStatus ||
                    (
                        this.bannedValue
                            ? "banned"
                            : "active"
                    );

                this.banReasonValue =
                    result.reason || "";
            } else {
                this.loggedInValue = false;
            }
        }

        accountStatus() {
            return this.accountStatusValue;
        }

        isBanned() {
            return this.bannedValue;
        }

        banReason() {
            return this.banReasonValue;
        }

        // ============================================================
        // ADMIN BAN
        // ============================================================

        async banUser(args) {
            const userId =
                String(args.USERID || "");

            const reason =
                String(args.REASON || "");

            await this.request(
                "/admin/ban",
                {
                    userId,
                    reason
                },
                true
            );
        }

        async unbanUser(args) {
            const userId =
                String(args.USERID || "");

            await this.request(
                "/admin/unban",
                {
                    userId
                },
                true
            );
        }

        async checkBan(args) {
            const userId =
                String(args.USERID || "");

            const result =
                await this.request(
                    "/admin/check-ban",
                    {
                        userId
                    },
                    true
                );

            if (result) {
                this.lastBanCheckValue =
                    Boolean(result.banned);

                this.lastBanReasonValue =
                    result.reason || "";
            } else {
                this.lastBanCheckValue = false;
                this.lastBanReasonValue = "";
            }
        }

        banCheckResult() {
            return Boolean(
                this.lastBanCheckValue
            );
        }

        lastBanReason() {
            return this.lastBanReasonValue;
        }

        // ============================================================
        // SEARCH USERS
        // ============================================================

        async searchUsers(args) {
            const query =
                String(args.QUERY || "").trim();

            if (!query) {
                this.searchResultsValue = "[]";
                return;
            }

            const result =
                await this.request(
                    "/search-users",
                    {
                        query
                    },
                    false
                );

            if (
                result &&
                result.success
            ) {
                this.searchResultsValue =
                    JSON.stringify(
                        result.users || []
                    );
            } else {
                this.searchResultsValue =
                    "[]";
            }
        }

        searchResults() {
            return this.searchResultsValue;
        }

        // ============================================================
        // AUTHENTICATED POST
        // ============================================================

        async authenticatedPost(args) {
            const url =
                String(args.URL || "");

            const data =
                String(args.DATA || "{}");

            let parsed;

            try {
                parsed =
                    JSON.parse(data);
            } catch (error) {
                this.lastErrorValue =
                    "Invalid JSON.";

                return "";
            }

            const endpoint =
                url.startsWith(this.apiUrlValue)
                    ? url.substring(
                        this.apiUrlValue.length
                    )
                    : url;

            const result =
                await this.request(
                    endpoint,
                    parsed,
                    true
                );

            return result
                ? JSON.stringify(result)
                : "";
        }

        // ============================================================
        // REQUEST
        // ============================================================

        async request(
            endpoint,
            body = {},
            authenticated = false,
            method = "POST"
        ) {
            this.lastErrorValue = "";
            this.lastStatusValue = 0;

            let url = endpoint;

            if (!url.startsWith("http")) {
                url =
                    this.apiUrlValue +
                    endpoint;
            }

            const headers = {
                "Accept":
                    "application/json"
            };

            if (method !== "GET") {
                headers[
                    "Content-Type"
                ] =
                    "application/json";
            }

            if (
                authenticated &&
                this.tokenValue
            ) {
                headers[
                    "Authorization"
                ] =
                    "Bearer " +
                    this.tokenValue;
            }

            try {
                const options = {
                    method,
                    headers
                };

                if (method !== "GET") {
                    options.body =
                        JSON.stringify(body);
                }

                const response =
                    await fetch(
                        url,
                        options
                    );

                this.lastStatusValue =
                    response.status;

                const text =
                    await response.text();

                this.lastResponseValue =
                    text;

                let result = null;

                try {
                    result =
                        JSON.parse(text);
                } catch (error) {
                    result = null;
                }

                if (!response.ok) {
                    this.lastErrorValue =
                        result?.error ||
                        text ||
                        `HTTP ${response.status}`;
                }

                return result;

            } catch (error) {
                this.lastErrorValue =
                    String(error);

                this.lastResponseValue =
                    "";

                return null;
            }
        }

        // ============================================================
        // LAST API DATA
        // ============================================================

        lastResponse() {
            return this.lastResponseValue;
        }

        apiError() {
            return this.lastErrorValue;
        }

        apiStatus() {
            return this.lastStatusValue;
        }
    }

    Scratch.extensions.register(
        new SignInUp()
    );

})(Scratch);
