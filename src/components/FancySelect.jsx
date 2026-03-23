import { useEffect, useMemo, useRef, useState } from "react";

function FancySelect({ id, value, options, onChange, placeholder, maxMenuHeight = 260 }) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const onEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, [isOpen]);

  const selectOption = (nextValue) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <div className={`fancy-select ${isOpen ? "fancy-select--open" : ""}`} ref={rootRef}>
      <button
        id={id}
        type="button"
        className="fancy-select__trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="fancy-select__value">
          {selectedOption?.swatch && (
            <span
              className="fancy-select__swatch"
              style={{ "--swatch-color": selectedOption.swatch }}
              aria-hidden="true"
            />
          )}
          <span>{selectedOption?.label || placeholder || ""}</span>
        </span>
      </button>
      {isOpen && (
        <div className="fancy-select__menu" role="listbox" style={{ maxHeight: `${maxMenuHeight}px` }}>
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                className={`fancy-select__option ${isActive ? "is-active" : ""}`}
                onClick={() => selectOption(option.value)}
                role="option"
                aria-selected={isActive}
              >
                <span className="fancy-select__value">
                  {option.swatch && (
                    <span
                      className="fancy-select__swatch"
                      style={{ "--swatch-color": option.swatch }}
                      aria-hidden="true"
                    />
                  )}
                  <span>{option.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FancySelect;
