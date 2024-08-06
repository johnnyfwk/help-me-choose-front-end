export function validateUsernameInput(username) {
    const regex = /^[a-zA-Z0-9]*$/;

    if (!regex.test(username)) {
        return {
            isValid: false,
            msg: "Username can only contain letters and numbers."
        };
    } else if (username.length < 3) {
        return {
            isValid: false,
            msg: "Username be at least 3 characters long."
        };
    } else {
        return {
            isValid: true,
            msg: ""
        };
    }
}

export function validatePasswordInput(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/;

    if (password.length < 8) {
        return {
            isValid: false,
            msg: "Password must be at least 8 characters long."
        };
    } else if (password.length > 128) {
        return {
            isValid: false,
            msg: "Password must be less than 128 characters."
        };
    } else {
        return {
            isValid: true,
            msg: ""
        };
    }
}