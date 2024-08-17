export default function InputEmail({
    email,
    handleEmail
}) {
    return (
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
    )
}