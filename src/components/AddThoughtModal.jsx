import { useEffect, useState } from "react";
import { TWEMOJI_BASE_PATH, twemojiIconOptions } from "../data/twemojiIcons";
import FancySelect from "./FancySelect";

const initialForm = {
  title: "",
  description: "",
  category: "",
  status: "idea",
  iconFile: "",
  nextAction: "",
  dueDate: "",
};

function AddThoughtModal({ isOpen, onClose, onSave, editingThought, categories, copy }) {
  const [formData, setFormData] = useState(initialForm);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (editingThought) {
      setFormData({
        title: editingThought.title,
        description: editingThought.description,
        category: editingThought.category,
        status: editingThought.status,
        iconFile: editingThought.iconFile || "",
        nextAction: editingThought.nextAction || "",
        dueDate: editingThought.dueDate || "",
      });
      setIsAddingCategory(false);
      return;
    }

    setFormData({
      ...initialForm,
      category: categories[0] || "",
    });
    setIsAddingCategory(categories.length === 0);
  }, [isOpen, editingThought, categories]);

  if (!isOpen) {
    return null;
  }

  const isEditing = Boolean(editingThought);
  const selectedCategoryValue = isAddingCategory ? "__new__" : formData.category;
  const categoryOptions = [
    ...categories.map((category) => ({ value: category, label: category })),
    { value: "__new__", label: copy.addNewCategory },
  ];
  const statusOptions = [
    { value: "idea", label: copy.statusIdea },
    { value: "in-progress", label: copy.statusInProgress },
    { value: "done", label: copy.statusDone },
  ];
  const iconOptions = [
    { value: "", label: copy.autoSelectIcon },
    ...twemojiIconOptions.map((icon) => ({ value: icon.file, label: icon.label })),
  ];

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      status: formData.status,
      iconFile: formData.iconFile,
      nextAction: formData.nextAction.trim(),
      dueDate: formData.dueDate,
    };

    if (!payload.title || !payload.description || !payload.category) {
      return;
    }

    onSave(payload);
    setFormData(initialForm);
    onClose();
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleCategorySelect = (value) => {
    if (value === "__new__") {
      setIsAddingCategory(true);
      setFormData((prev) => ({
        ...prev,
        category: "",
      }));
      return;
    }

    setIsAddingCategory(false);
    updateField("category", value);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal__header">
          <h2 id="modal-title">{isEditing ? copy.modalEditTitle : copy.modalCreateTitle}</h2>
          <button type="button" className="ghost-btn" onClick={onClose}>
            {copy.close}
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label htmlFor="thought-title">
            {copy.title}
            <input
              id="thought-title"
              type="text"
              value={formData.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder={copy.titlePlaceholder}
              required
            />
          </label>
          <label htmlFor="thought-description">
            {copy.description}
            <textarea
              id="thought-description"
              value={formData.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder={copy.descriptionPlaceholder}
              rows={4}
              required
            />
          </label>
          <div className="modal-form__row">
            <label htmlFor="thought-category">
              {copy.categoryLabel}
              <FancySelect
                id="thought-category"
                value={selectedCategoryValue}
                options={categoryOptions}
                onChange={handleCategorySelect}
              />
              {isAddingCategory && (
                <input
                  id="thought-category-new"
                  type="text"
                  value={formData.category}
                  onChange={(event) => updateField("category", event.target.value)}
                  placeholder={copy.newCategoryPlaceholder}
                  required
                />
              )}
            </label>
            <label htmlFor="thought-status">
              {copy.statusLabel}
              <FancySelect
                id="thought-status"
                value={formData.status}
                options={statusOptions}
                onChange={(nextValue) => updateField("status", nextValue)}
              />
            </label>
          </div>
          <div className="modal-form__row modal-form__row--icon">
            <label htmlFor="thought-icon">
              {copy.icon}
              <FancySelect
                id="thought-icon"
                value={formData.iconFile}
                options={iconOptions}
                onChange={(nextValue) => updateField("iconFile", nextValue)}
                maxMenuHeight={220}
              />
            </label>
            <div className="icon-preview" aria-live="polite">
              <span>{copy.preview}</span>
              {formData.iconFile ? (
                <img src={`${TWEMOJI_BASE_PATH}/${formData.iconFile}`} alt="Selected icon preview" />
              ) : null}
            </div>
          </div>
          <div className="modal-form__row">
            <label htmlFor="thought-next-action">
              {copy.nextActionLabel}
              <input
                id="thought-next-action"
                type="text"
                value={formData.nextAction}
                onChange={(event) => updateField("nextAction", event.target.value)}
                placeholder={copy.nextActionPlaceholder}
              />
            </label>
            <label htmlFor="thought-due-date">
              {copy.dueDateLabel}
              <input
                id="thought-due-date"
                type="date"
                value={formData.dueDate}
                onChange={(event) => updateField("dueDate", event.target.value)}
              />
            </label>
          </div>
          <button type="submit" className="primary-btn">
            {isEditing ? copy.updateThought : copy.saveThought}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddThoughtModal;
