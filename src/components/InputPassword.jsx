export default function InputPassword({
    inputPassword,
    setInputPassword,
    inputPasswordErrorMessage,
    setInputPasswordErrorMessage
}) {
    function handleInputPassword(event) {
        setInputPassword(event.target.value);
        setInputPasswordErrorMessage("");
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
                value={inputPassword}
                onChange={handleInputPassword}
                maxLength="128"
            ></input>

            <div className="error">{inputPasswordErrorMessage}</div>
        </div>
    )
}