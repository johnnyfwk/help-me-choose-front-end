export default function InputEmail({
    email,
    setEmail,
    emailErrorMessage,
    setEmailErrorMessage
}) {
    function handleEmail(event) {
        setEmail(event.target.value);
        setEmailErrorMessage("");
    }

    return (
        <div id="email-input">
            <label
                htmlFor="email"
            >Email</label>

            <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmail}
                maxLength="254"
                required
            ></input>

            <div className="error">{emailErrorMessage}</div>
        </div>
    )
}