import FancySelect from "./FancySelect";

function FilterBar({ categories, selectedCategory, onCategoryChange, label, allLabel }) {
  const options = [
    { value: "all", label: allLabel },
    ...categories.map((category) => ({ value: category, label: category })),
  ];

  return (
    <div className="filter-bar">
      <span>{label}</span>
      <FancySelect
        id="category-filter"
        value={selectedCategory}
        options={options}
        onChange={onCategoryChange}
      />
    </div>
  );
}

export default FilterBar;
