export default function InputPassword({
    id,
    password,
    handlePassword,
    placeholder
}) {
    return (
        <input
            type="password"
            id={id}
            name="password"
            value={password}
            onChange={handlePassword}
            maxLength="128"
            placeholder={placeholder}
            required
        ></input>
    )
}