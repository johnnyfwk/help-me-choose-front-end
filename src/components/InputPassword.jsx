export default function InputPassword({
    password,
    setPassword,
    passwordErrorMessage,
    setPasswordErrorMessage
}) {
    function handlePassword(event) {
        setPassword(event.target.value);
        setPasswordErrorMessage("");
    }

    return (
        <div id="password-input">
            <label
                htmlFor="password"
            >Password</label>

            <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePassword}
                maxLength="128"
            ></input>

            <div className="error">{passwordErrorMessage}</div>
        </div>
    )
}