import { getIconForThought } from "../utils/thoughtIcons";

function formatDate(dateValue, locale) {
  const date = new Date(dateValue);
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getDueState(dueDateValue) {
  if (!dueDateValue) {
    return "none";
  }

  const due = new Date(`${dueDateValue}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(due.getTime())) {
    return "none";
  }

  if (due.getTime() < today.getTime()) {
    return "overdue";
  }

  if (due.getTime() === today.getTime()) {
    return "today";
  }

  return "upcoming";
}

function ThoughtCard({ thought, onEdit, onDelete, copy, locale }) {
  const thoughtIcon = getIconForThought(thought);
  const statusLabelMap = {
    idea: copy.statusIdea,
    "in-progress": copy.statusInProgress,
    done: copy.statusDone,
  };
  const dueState = getDueState(thought.dueDate);

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
      {(thought.nextAction || thought.dueDate) && (
        <div className="thought-card__meta">
          {thought.nextAction && (
            <p className="thought-card__next-action">
              <span>{copy.nextActionLabel}:</span> {thought.nextAction}
            </p>
          )}
          <p className="thought-card__due-date">
            <span>{copy.dueDateLabel}:</span>{" "}
            {thought.dueDate ? formatDate(thought.dueDate, locale) : copy.noDueDate}
            {dueState === "overdue" && (
              <em className="thought-card__due-badge thought-card__due-badge--overdue">{copy.overdue}</em>
            )}
            {dueState === "today" && (
              <em className="thought-card__due-badge thought-card__due-badge--today">{copy.dueToday}</em>
            )}
          </p>
        </div>
      )}
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
