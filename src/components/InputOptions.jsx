export default function InputOptions({
    options,
    setOptions,
    setError
}) {
    function handleOptions(index, value) {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
        setError("");
    }

    return (
        <div id="input-options">
            {options.map((option, index) => {
                return (
                    <div key={index}>
                        {/* <label htmlFor={`option-${index}`}>Option {index + 1}:</label> */}
                        <input
                            type="text"
                            id={`option-${index}`}
                            name={`option-${index}`}
                            value={option}
                            onChange={(event) => handleOptions(index, event.target.value)}
                            placeholder={`Option ${index + 1}`}
                            required
                        />
                    </div>
                )
            })}
        </div>
    )
}