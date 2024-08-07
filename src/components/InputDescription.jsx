export default function InputDescription({
    description,
    setDescription
}) {
    function handleDescription(event) {
        setDescription(event.target.value);
    }

    return (
        <div id="input-description">
            <label
                htmlFor="description"
            ></label>

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