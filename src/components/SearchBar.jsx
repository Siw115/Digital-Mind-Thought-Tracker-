function SearchBar({ value, onChange, label, placeholder }) {
  return (
    <label className="search-bar" htmlFor="search-thoughts">
      <span>{label}</span>
      <input
        id="search-thoughts"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

export default SearchBar;
