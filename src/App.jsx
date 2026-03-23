import { useEffect, useMemo, useState } from "react";
import AddThoughtModal from "./components/AddThoughtModal";
import FilterBar from "./components/FilterBar";
import SearchBar from "./components/SearchBar";
import ThoughtGrid from "./components/ThoughtGrid";
import Toast from "./components/Toast";
import FancySelect from "./components/FancySelect";
import { sampleThoughts } from "./data/sampleThoughts";
import { themeOptions } from "./data/themes";
import { translations } from "./i18n/translations";

const ACTIVE_USER_STORAGE_KEY = "digital-mind.active-user";
const THOUGHTS_STORAGE_PREFIX = "digital-mind.thoughts";
const THEME_STORAGE_KEY = "digital-mind.theme";
const LANGUAGE_STORAGE_KEY = "digital-mind.language";

function normalizeWorkspaceName(value) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function getThoughtsStorageKey(workspaceName) {
  return `${THOUGHTS_STORAGE_PREFIX}.${workspaceName}`;
}

function getInitialWorkspace() {
  const saved = window.localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
  if (!saved) {
    return "guest";
  }
  return normalizeWorkspaceName(saved) || "guest";
}

function loadThoughtsForWorkspace(workspaceName) {
  const storageKey = getThoughtsStorageKey(workspaceName);
  const raw = window.localStorage.getItem(storageKey);

  if (!raw) {
    return sampleThoughts;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : sampleThoughts;
  } catch {
    return sampleThoughts;
  }
}

function createThought(payload) {
  return {
    id: `th-${Date.now()}`,
    title: payload.title,
    description: payload.description,
    category: payload.category,
    status: payload.status,
    iconFile: payload.iconFile || "",
    nextAction: payload.nextAction || "",
    dueDate: payload.dueDate || "",
    date: new Date().toISOString().split("T")[0],
  };
}

function getInitialTheme() {
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (!saved) {
    return "moss";
  }

  const exists = themeOptions.some((theme) => theme.id === saved);
  return exists ? saved : "moss";
}

function getInitialLanguage() {
  const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (saved === "nl" || saved === "en") {
    return saved;
  }
  return "en";
}

function App() {
  const [language, setLanguage] = useState(() => getInitialLanguage());
  const [theme, setTheme] = useState(() => getInitialTheme());
  const [activeWorkspace, setActiveWorkspace] = useState(() => getInitialWorkspace());
  const [workspaceInput, setWorkspaceInput] = useState(() => getInitialWorkspace());
  const [thoughts, setThoughts] = useState(() => loadThoughtsForWorkspace(getInitialWorkspace()));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingThought, setEditingThought] = useState(null);
  const [toast, setToast] = useState(null);
  const copy = translations[language];

  const categories = useMemo(() => {
    return [...new Set(thoughts.map((thought) => thought.category))].sort();
  }, [thoughts]);

  const filteredThoughts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return thoughts.filter((thought) => {
      const matchesSearch =
        thought.title.toLowerCase().includes(normalizedSearch) ||
        thought.description.toLowerCase().includes(normalizedSearch) ||
        (thought.nextAction || "").toLowerCase().includes(normalizedSearch);
      const matchesCategory =
        selectedCategory === "all" || thought.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [thoughts, searchQuery, selectedCategory]);

  const handleOpenCreateModal = () => {
    setEditingThought(null);
    setIsModalOpen(true);
  };

  const showToast = (message, type = "success") => {
    setToast({
      id: Date.now(),
      message,
      type,
    });
  };

  const handleWorkspaceSwitch = () => {
    const normalized = normalizeWorkspaceName(workspaceInput);
    if (!normalized) {
      showToast(copy.toastEnterProfile, "info");
      return;
    }

    setActiveWorkspace(normalized);
    setWorkspaceInput(normalized);
    setThoughts(loadThoughtsForWorkspace(normalized));
    setSearchQuery("");
    setSelectedCategory("all");
    setEditingThought(null);
    setIsModalOpen(false);
    showToast(`${copy.toastProfileLoaded} ${normalized}`);
  };

  const handleOpenEditModal = (thought) => {
    setEditingThought(thought);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingThought(null);
  };

  const handleSaveThought = (payload) => {
    if (editingThought) {
      setThoughts((prev) =>
        prev.map((item) =>
          item.id === editingThought.id
            ? {
                ...item,
                ...payload,
                nextAction: payload.nextAction || "",
                dueDate: payload.dueDate || "",
              }
            : item
        )
      );
      showToast(copy.toastThoughtUpdated);
      return;
    }

    setThoughts((prev) => [createThought(payload), ...prev]);
    showToast(copy.toastThoughtCreated);
  };

  const handleDeleteThought = (id) => {
    const shouldDelete = window.confirm(copy.deleteConfirm);
    if (!shouldDelete) {
      return;
    }
    setThoughts((prev) => prev.filter((item) => item.id !== id));
    showToast(copy.toastThoughtDeleted);
  };

  const handleMoveThoughtToStatus = (id, nextStatus) => {
    setThoughts((prev) => {
      const current = prev.find((item) => item.id === id);
      if (!current || current.status === nextStatus) {
        return prev;
      }

      return prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
            }
          : item
      );
    });
  };

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 2200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  useEffect(() => {
    window.localStorage.setItem(ACTIVE_USER_STORAGE_KEY, activeWorkspace);
  }, [activeWorkspace]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    const storageKey = getThoughtsStorageKey(activeWorkspace);
    window.localStorage.setItem(storageKey, JSON.stringify(thoughts));
  }, [activeWorkspace, thoughts]);

  const languageOptions = [
    { value: "en", label: copy.languageEnglish, flagSrc: "/assets/flags/en.svg" },
    { value: "nl", label: copy.languageDutch, flagSrc: "/assets/flags/nl.svg" },
  ];
  const themeSelectOptions = themeOptions.map((option) => ({
    value: option.id,
    label: copy.themeLabels[option.id],
    swatch: option.swatch,
  }));

  return (
    <div className="app-shell">
      <div className="bg-glow bg-glow--top" />
      <div className="bg-glow bg-glow--bottom" />
      <section className="topbar" aria-label={copy.themeSelectorLabel}>
        <div className="topbar__left">
          <div className="topbar__item">
            {copy.languageLabel}
            <div className="language-switch" role="group" aria-label={copy.languageLabel}>
              {languageOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`language-switch__btn ${
                    language === option.value ? "language-switch__btn--active" : ""
                  }`}
                  onClick={() => setLanguage(option.value)}
                  title={option.label}
                  aria-label={option.label}
                >
                  <img src={option.flagSrc} alt="" />
                </button>
              ))}
            </div>
          </div>
          <div className="topbar__item">
            {copy.themeLabel}
            <FancySelect
              id="dashboard-theme"
              value={theme}
              options={themeSelectOptions}
              onChange={setTheme}
            />
          </div>
        </div>
        <div className="topbar__right">
          <p className="active-profile-chip">
            {copy.activeProfile}: <strong>{activeWorkspace}</strong>
          </p>
          <section className="workspace-bar workspace-bar--compact" aria-label={copy.profileSelectorLabel}>
            <div className="workspace-mini__header">
              <p className="workspace-mini__title">
                <span className="workspace-mini__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M5 19a7 7 0 0 1 14 0" />
                  </svg>
                </span>
                {copy.profileName}
              </p>
              <button type="button" className="ghost-btn" onClick={handleWorkspaceSwitch}>
                <span className="workspace-mini__btn-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 12a8 8 0 0 1 13.5-5.7" />
                    <path d="M17.5 3.5v4h-4" />
                    <path d="M20 12a8 8 0 0 1-13.5 5.7" />
                    <path d="M6.5 20.5v-4h4" />
                  </svg>
                </span>
                {copy.loadProfile}
              </button>
            </div>
            <div className="workspace-mini__input-wrap">
              <span className="workspace-mini__input-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 20h4l10-10-4-4L4 16v4z" />
                  <path d="M12 6l4 4" />
                </svg>
              </span>
              <input
                id="workspace-name"
                type="text"
                value={workspaceInput}
                onChange={(event) => setWorkspaceInput(event.target.value)}
                placeholder={copy.profilePlaceholder}
              />
            </div>
            <div className="workspace-info">
              <button
                type="button"
                className="workspace-info__btn"
                aria-label={copy.profileHint}
                title={copy.profileHint}
              >
                i
              </button>
              <span className="workspace-info__tooltip" role="note">
                {copy.profileHint}
              </span>
            </div>
          </section>
        </div>
      </section>
      <main className="container">

        <header className="hero">
          <div>
            <p className="hero__kicker">Digital Mind</p>
            <h1>Thought Tracker</h1>
            <p className="hero__subtitle">{copy.heroSubtitle}</p>
            <div className="hero__actions">
              <button type="button" className="primary-btn" onClick={handleOpenCreateModal}>
                {copy.newThought}
              </button>
            </div>
          </div>
        </header>

        <section className="controls">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            label={copy.searchLabel}
            placeholder={copy.searchPlaceholder}
          />
          <FilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            label={copy.categoryLabel}
            allLabel={copy.allCategories}
          />
        </section>

        <ThoughtGrid
          thoughts={filteredThoughts}
          onEditThought={handleOpenEditModal}
          onDeleteThought={handleDeleteThought}
          onStatusChange={handleMoveThoughtToStatus}
          copy={copy}
          locale={copy.locale}
        />
      </main>

      <AddThoughtModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveThought}
        editingThought={editingThought}
        categories={categories}
        copy={copy}
      />
      <Toast toast={toast} />
    </div>
  );
}

export default App;
