export default function InputUsername({
    username,
    setUsername,
    setUsernameErrorMessage,
    setError,
    registeredUsernames,
    isUsernameAvailable,
    setIsUsernameAvailable
}) {
    function handleUsername(event) {
        const registeredDisplayNames = registeredUsernames.map((registeredUsername) => {
            return registeredUsername.displayName.toLowerCase();
        });
        console.log("registeredDisplayNames:", registeredDisplayNames);

        const isDisplayNameAvailable = !registeredDisplayNames.includes(event.target.value.toLowerCase());
        console.log("isDisplayNameAvailable", isDisplayNameAvailable);

        setUsername(event.target.value);
        setUsernameErrorMessage("");
        setError("");

        const regex = /[^A-Za-z0-9]/;

        if (event.target.value.length < 3) {
            setIsUsernameAvailable(null);
        } else {
            if (regex.test(event.target.value)) {
                setIsUsernameAvailable(false);
            } else if (isDisplayNameAvailable) {
                setIsUsernameAvailable(true);
            } else {
                setIsUsernameAvailable(false);
            }
        }
    }

    return (
        <div id="username-input">
            <label
                htmlFor="username"
            >Username</label>

            <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleUsername}
                maxLength="20"
                size="20"
                placeholder="Username"
                required
            ></input>

            {isUsernameAvailable
                ? <div className="success">Available</div>
                : null
            }

            {isUsernameAvailable === false
                ? <div className="error">Not Available</div>
                : null
            }
        </div>
    )
}