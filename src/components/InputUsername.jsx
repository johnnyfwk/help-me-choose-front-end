export default function InputUsername({
    inputUsername,
    setInputUsername,
    inputUsernameErrorMessage,
    setInputUsernameErrorMessage
}) {
    function handleInputUsername(event) {
        setInputUsername(event.target.value);
        setInputUsernameErrorMessage("");
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
                value={inputUsername}
                onChange={handleInputUsername}
                maxLength="20"
                size="20"
            ></input>

            <div className="error">{inputUsernameErrorMessage}</div>
        </div>
    )
}