export default function InputEmailOrUsername({
    emailOrUsername,
    setEmailOrUsername,
    emailOrUsernameErrorMessage,
    setEmailOrUsernameErrorMessage,
    setError
}) {
    function handleEmailOrUsername(event) {
        setEmailOrUsername(event.target.value);
        setEmailOrUsernameErrorMessage("");
        setError("");
    }

    return (
        <div id="email-or-username-input">
            <label
                htmlFor="email-or-username"
            >Email / Username</label>

            <input
                type="text"
                id="email-or-username"
                name="email-or-username"
                value={emailOrUsername}
                onChange={handleEmailOrUsername}
                maxLength="254"
                required
            ></input>

            <div className="error">{emailOrUsernameErrorMessage}</div>
        </div>
    )
}