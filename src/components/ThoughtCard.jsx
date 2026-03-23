import { getIconForThought } from "../utils/thoughtIcons";

function formatDate(dateValue, locale) {
  const date = new Date(dateValue);
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function ThoughtCard({ thought, onEdit, onDelete, copy, locale }) {
  const thoughtIcon = getIconForThought(thought);
  const statusLabelMap = {
    idea: copy.statusIdea,
    "in-progress": copy.statusInProgress,
    done: copy.statusDone,
  };

  return (
    <article className="thought-card">
      <div className="thought-card__top">
        <div className="thought-card__category-wrap">
          <img className="thought-card__icon" src={thoughtIcon.src} alt={thoughtIcon.alt} />
          <span className="thought-card__category">{thought.category}</span>
        </div>
        <span className={`thought-card__status status-${thought.status}`}>
          {statusLabelMap[thought.status]}
        </span>
      </div>
      <h3>{thought.title}</h3>
      <p>{thought.description}</p>
      <div className="thought-card__footer">
        <time dateTime={thought.date}>{formatDate(thought.date, locale)}</time>
        <div className="thought-card__actions">
          <button type="button" className="chip-btn" onClick={onEdit}>
            {copy.edit}
          </button>
          <button type="button" className="chip-btn chip-btn--danger" onClick={onDelete}>
            {copy.delete}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ThoughtCard;
