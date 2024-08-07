export default function InputTitle({
    title,
    setTitle
}) {
    function handleTitle(event) {
        setTitle(event.target.value);
    }

    return (
        <div id="input-title">
            <label
                htmlFor="title"
            ></label>

            <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={handleTitle}
                maxLength="100"
                placeholder="Enter your question title"
                required
            ></input>
        </div>
    )
}