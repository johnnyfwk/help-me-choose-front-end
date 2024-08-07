export default function InputUsername({
    username,
    setUsername,
    usernameErrorMessage,
    setUsernameErrorMessage,
    setError
}) {
    function handleUsername(event) {
        setUsername(event.target.value);
        setUsernameErrorMessage("");
        setError("");
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
                required
            ></input>

            <div className="error">{usernameErrorMessage}</div>
        </div>
    )
}