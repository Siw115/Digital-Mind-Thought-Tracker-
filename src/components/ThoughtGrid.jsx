import ThoughtCard from "./ThoughtCard";

const BOARD_COLUMNS = [
  { id: "idea", copyKey: "statusIdea" },
  { id: "in-progress", copyKey: "statusInProgress" },
  { id: "done", copyKey: "statusDone" },
];

function ThoughtGrid({ thoughts, onEditThought, onDeleteThought, onStatusChange, copy, locale }) {
  const thoughtsByStatus = BOARD_COLUMNS.reduce((accumulator, column) => {
    accumulator[column.id] = thoughts.filter((thought) => thought.status === column.id);
    return accumulator;
  }, {});

  if (thoughts.length === 0) {
    return (
      <section className="empty-state">
        <h2>{copy.emptyTitle}</h2>
        <p>{copy.emptyDescription}</p>
      </section>
    );
  }

  return (
    <section className="thought-board" aria-label={copy.thoughtSummary}>
      {BOARD_COLUMNS.map((column) => (
        <div
          key={column.id}
          className="thought-column"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const thoughtId = event.dataTransfer.getData("text/thought-id");
            if (thoughtId) {
              onStatusChange(thoughtId, column.id);
            }
          }}
        >
          <header className="thought-column__header">
            <h2>{copy[column.copyKey]}</h2>
            <span>{thoughtsByStatus[column.id].length}</span>
          </header>
          <div className="thought-column__list">
            {thoughtsByStatus[column.id].map((thought, index) => (
              <div
                key={thought.id}
                className="thought-grid__item"
                style={{ "--stagger": index }}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/thought-id", thought.id);
                }}
              >
                <ThoughtCard
                  thought={thought}
                  onEdit={() => onEditThought(thought)}
                  onDelete={() => onDeleteThought(thought.id)}
                  copy={copy}
                  locale={locale}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default ThoughtGrid;
