import { categories } from "../assets/data/categories";
const sortedUniqueCategories = Array.from(new Set(categories)).sort();

export default function InputCategory({
    category,
    setCategory
}) {
    function handleCategory(event) {
        setCategory(event.target.value);
    }

    return (
        <div id="input-category">
            <label htmlFor="category"></label>
            <select
                id="category"
                name="category"
                value={category}
                onChange={handleCategory}
            >
                <option value="" disabled>Select a Category</option>
                {sortedUniqueCategories.map((category, index) => {
                    return <option key={index} value={category}>{category}</option>
                })}
            </select>
        </div>
    )
}