export default function InputUsername({
    username,
    handleUsername
}) {
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
        </div>
    )
}