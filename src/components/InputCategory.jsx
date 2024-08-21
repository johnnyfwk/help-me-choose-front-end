import { categories } from "../assets/data/categories";
const categoriesList = Array.from(new Set(categories)).sort();

export default function InputCategory({
    category,
    handleCategory,
    page
}) {
    return (
        <div>
            <select
                id="category"
                name="category"
                value={category}
                onChange={handleCategory}
            >
                {page === "create a poll"
                    ? <option value="" disabled>Select a Category</option>
                    : null
                }                

                {page === "home"
                    ? <option value="">All</option>
                    : null
                }
                
                {categoriesList.map((category, index) => {
                    return <option key={index} value={category}>{category}</option>
                })}
            </select>
        </div>
        
    )
}