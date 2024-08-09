export default function InputOptions({
    options,
    handleOptions,
}) {
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
                        className="input-option"
                    />
                )
            })}
        </div>
    )
}