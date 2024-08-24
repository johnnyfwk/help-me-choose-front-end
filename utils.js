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
            return false;
        });
}

export function formatDate(timestamp) {
    if (timestamp) {
        const milliseconds = (timestamp.seconds * 1000) + (timestamp.nanoseconds / 1000000);
        const date = new Date(milliseconds);

        const timeFormatter = new Intl.DateTimeFormat('en-UK', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        });

        const dateFormatter = new Intl.DateTimeFormat('en-UK', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

        const timeString = timeFormatter.format(date);
        const dateString = dateFormatter.format(date);

        return `${timeString} ${dateString}`;
    } else {
        return null;
    }
}

export function extractDocData(collection) {
    let list = collection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return list;
}

export function convertToSlug(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/&/g, 'and')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export function convertSlugToCategory(slug) {
    if (slug === null) {
        return "";
    }
    return slug
        .replace(/-/g, ' ')
        .replace(/\b[a-z]/g, char => char.toUpperCase())
        .replace(/\bAnd\b/gi, '&')
        .replace(/\bTv\b/gi, 'TV')
        .replace(/\bDiy\b/gi, 'DIY')
}

export function getDocumentCount(getCountFromServer, query, setTotalDocuments) {
    return getCountFromServer(query)
        .then((snapshot) => {
            const totalDocuments = snapshot.data().count;
            setTotalDocuments(totalDocuments);
        })
        .catch((error) => {
            console.error("Error fetching document count: ", error);
        })
}

export function fetchPaginatedDocuments(
    setIsFetching,
    collection,
    db,
    collectionName,
    page,
    query,
    filterName,
    filterValue,
    where,
    fieldName,
    orderBy,
    orderByName,
    limit,
    documentsPerPage,
    getDocs,
    startAfter,
    setDocuments,
    setFetchDocumentsMessage,
) {
    setIsFetching(true);

    const collectionRef = collection(db, collectionName);

    let q;

    if (page === 1) {
        q = query(
            collectionRef,
            ...(filterName ? [where(fieldName, "==", filterValue)] : []),
            orderBy(orderByName, 'desc'),
            limit(documentsPerPage)
        );
    } else {
        const offset = (page - 1) * documentsPerPage;

        const tempQuery = query(
            collectionRef,
            ...(filterName ? [where(fieldName, "==", filterValue)] : []),
            orderBy(orderByName, 'desc'),
            limit(offset)
        );

        getDocs(tempQuery)
            .then((snapshot) => {
                if (!snapshot.empty) {
                    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

                    q = query(
                        collectionRef,
                        ...(filterName ? [where(fieldName, "==", filterValue)] : []),
                        orderBy(orderByName, 'desc'),
                        startAfter(lastVisible),
                        limit(documentsPerPage)
                    );

                    return getDocs(q);
                }
            })
            .then((snapshot) => {
                if (snapshot) {
                    const documents = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setDocuments(documents);
                }
                setIsFetching(false);
            })
            .catch((error) => {
                console.log(error);
                setIsFetching(false);
                setFetchDocumentsMessage("Could not fetch documents.");
            });

        return;
    }

    return getDocs(q)
        .then((snapshot) => {
            const documents = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setDocuments(documents);
            setIsFetching(false);
        })
        .catch((error) => {
            console.log(error);
            setIsFetching(false);
            setFetchDocumentsMessage("Could not fetch documents.");
        })
}