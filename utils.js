export function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        return {
            isValid: false,
            msg: "Email entered is not valid."
        };
    } else {
        return {
            isValid: true,
            msg: ""
        };
    }
}

export function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9]*$/;

    if (!usernameRegex.test(username)) {
        return {
            isValid: false,
            msg: "Username can only contain letters and numbers."
        };
    } else if (username.length < 3) {
        return {
            isValid: false,
            msg: "Username must be at least 3 characters long."
        };
    } else {
        return {
            isValid: true,
            msg: ""
        };
    }
}

export function validatePassword(password) {
    if (password.length < 8) {
        return {
            isValid: false,
            msg: "Password must be at least 8 characters long."
        };
    } else if (password.length > 128) {
        return {
            isValid: false,
            msg: "Password must be 128 characters or less."
        };
    } else {
        return {
            isValid: true,
            msg: ""
        };
    }
}