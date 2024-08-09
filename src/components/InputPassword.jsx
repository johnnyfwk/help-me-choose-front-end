export default function InputPassword({
    password,
    setPassword,
    passwordErrorMessage,
    setPasswordErrorMessage,
    setError
}) {
    function handlePassword(event) {
        setPassword(event.target.value);
        setPasswordErrorMessage("");
        setError("");
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
                placeholder="Password"
                required
            ></input>
        </div>
    )
}