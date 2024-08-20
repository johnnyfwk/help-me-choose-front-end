export default function InputOptions({
    options,
    handleOptionNames,
    handleOptionImages,
    optionImageUrlError
}) {
    return (
        <div id="input-options">
            {options.map((option, index) => {
                return (
                    <div key={index}>
                        <input                            
                            type="text"
                            id={`option-${index}-name`}
                            name={`option-${index}-name`}
                            value={option.name}
                            onChange={(event) => handleOptionNames(index, event.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="input-option"
                        />

                        {optionImageUrlError.imageUrls.includes(option.imageUrl.trim())
                            ? <div className="error">{optionImageUrlError.msg}</div>
                            : null
                        }

                        <input
                            type="text"
                            id={`option-${index}-image-url`}
                            name={`option-${index}-image-url`}
                            value={option.name ? option.imageUrl : ""}
                            onChange={(event) => handleOptionImages(index, event.target.value)}
                            maxLength="2083"
                            placeholder={`Option ${index + 1} Image URL`}
                            disabled={!options[index].name}
                        ></input>
                    </div>
                )
            })}
        </div>
    )
}