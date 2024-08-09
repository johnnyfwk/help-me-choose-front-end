export default function InputOptions({
    options,
    setOptions,
    setOptionsError
}) {
    function handleOptions(index, value) {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
        setOptionsError("");
    }

    return (
        <div id="input-options">
            {options.map((option, index) => {
                return (
                    <input
                        key={index}
                        type="text"
                        id={`option-${index}`}
                        name={`option-${index}`}
                        value={option}
                        onChange={(event) => handleOptions(index, event.target.value)}
                        placeholder={`Option ${index + 1}`}
                        required
                    />
                )
            })}
        </div>
    )
}