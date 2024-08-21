export default function InputDescription({
    description,
    handleDescription
}) {
    return (
        <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleDescription}
            maxLength="2000"
            placeholder="Enter details about the choice you have to make."
            required
        ></textarea>
    )
}