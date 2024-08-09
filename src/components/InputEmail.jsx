export default function InputEmail({
    email,
    setEmail,
    setEmailErrorMessage,
    setError
}) {
    function handleEmail(event) {
        setEmail(event.target.value);
        setEmailErrorMessage("");
        setError("");
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
                placeholder="Email"
                required
            ></input>
        </div>
    )
}