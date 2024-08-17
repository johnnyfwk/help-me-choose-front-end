import { Timestamp } from "firebase/firestore";

export function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

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

export function validateUsername(username, registeredUsernames) {
    const usernameRegex = /^[a-zA-Z0-9]*$/;

    const registeredDisplayNames = registeredUsernames.map((registeredUsername) => {
        return registeredUsername.displayName.toLowerCase();
    });

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
    } else if (registeredDisplayNames.includes(username.toLowerCase())) {
        return {
            isValid: false,
            msg: "Username is not available."
        }
    } else {
        return {
            isValid: true,
            msg: ""
        };
    }
}

export function validatePassword(password) {
    if (password.length < 6) {
        return {
            isValid: false,
            msg: "Password must be at least 6 characters long."
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

export function validateImageUrl(url) {
    return fetch(url, { method: 'HEAD' })
        .then((response) => {
            return response.ok && response.headers.get('content-type').startsWith('image/');
        })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log(error);
            return false;
        });
}

export function formatDate(timestamp) {
    if (timestamp) {
        const milliseconds = (timestamp.seconds * 1000) + (timestamp.nanoseconds / 1000000);
        const date = new Date(milliseconds);
    
        const formatter = new Intl.DateTimeFormat('en-UK', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    
        return formatter.format(date);
    } else {
        return null;
    }
}

export function extractDocData(collection) {
    let list = collection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return list;
}

export function sortQuestions(questions) {
    const questionsSorted = questions.sort((a, b) => {
        const latestA = a.questionModified ? a.questionModified.seconds : a.questionCreated.seconds;
        const latestB = b.questionModified ? b.questionModified.seconds : b.questionCreated.seconds;
        return latestB - latestA;
    });
    return questionsSorted;
}