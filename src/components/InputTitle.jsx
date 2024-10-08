export default function InputTitle({
    title,
    handleTitle
}) {
    return (
        <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleTitle}
            maxLength="100"
            placeholder="Poll Title"
            required
        ></input>
    )
}