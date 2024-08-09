export default function InputDescription({
    description,
    handleDescription
}) {
    return (
        <div id="input-description">
            <textarea
                id="description"
                name="description"
                value={description}
                onChange={handleDescription}
                maxLength="2000"
                placeholder="Enter details about your question."
                required
            ></textarea>
        </div>
    )
}