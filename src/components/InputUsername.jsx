export default function InputUsername({
    username,
    handleUsername
}) {
    return (
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
    )
}