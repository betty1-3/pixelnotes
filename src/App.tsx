import { useMemo, useState } from "react";

type Note = {
  id: number;
  title: string;
  body: string;
  color: "pink" | "peach" | "lilac";
  folder: string;
  pinned: boolean;
  updated: string;
};

const starterNotes: Note[] = [
  {
    id: 1,
    title: "tiny joys",
    body: "buy fresh flowers\nmake strawberry toast\ncall grandma",
    color: "pink",
    folder: "Personal",
    pinned: true,
    updated: "09:42",
  },
  {
    id: 2,
    title: "weekend plan",
    body: "thrift store at 11\npicnic if it’s sunny\nfinish my little book",
    color: "peach",
    folder: "Plans",
    pinned: false,
    updated: "08:15",
  },
  {
    id: 3,
    title: "remember",
    body: "you do not have to do everything today.",
    color: "lilac",
    folder: "Personal",
    pinned: true,
    updated: "YESTERDAY",
  },
  {
    id: 4,
    title: "ideas.zip",
    body: "make a photo wall\nlearn how to crochet\na cake shaped like a heart",
    color: "pink",
    folder: "Ideas",
    pinned: false,
    updated: "MONDAY",
  },
];

const colors: Note["color"][] = ["pink", "peach", "lilac"];

function PixelIcon({ type }: { type: "plus" | "search" | "pin" | "trash" }) {
  if (type === "plus") return <span aria-hidden="true">＋</span>;
  if (type === "search") return <span aria-hidden="true">⌕</span>;
  if (type === "trash") return <span aria-hidden="true">×</span>;
  return <span aria-hidden="true">◆</span>;
}

export default function App() {
  const [notes, setNotes] = useState(starterNotes);
  const [folders, setFolders] = useState(["Personal", "Plans", "Ideas"]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showWidget, setShowWidget] = useState(false);
  const [widgetIndex, setWidgetIndex] = useState(0);

  const widgetNote = notes.length > 0 ? notes[widgetIndex % notes.length] : null;

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    return notes
      .filter((note) => {
        if (filter === "pinned") return note.pinned;
        if (filter === "all") return true;
        return note.folder === filter;
      })
      .filter(
        (note) =>
          note.title.toLowerCase().includes(normalizedQuery) ||
          note.body.toLowerCase().includes(normalizedQuery),
      )
      .sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }, [filter, notes, query]);

  const updateNote = (id: number, updates: Partial<Note>) => {
    setNotes((current) =>
      current.map((note) =>
        note.id === id ? { ...note, ...updates, updated: "NOW" } : note,
      ),
    );
  };

  const addNote = () => {
    const nextId = Math.max(0, ...notes.map((note) => note.id)) + 1;
    const activeFolder =
      filter !== "all" && filter !== "pinned" ? filter : folders[0] ?? "Notes";
    setNotes((current) => [
      {
        id: nextId,
        title: "new note",
        body: "type something sweet...",
        color: "pink",
        folder: activeFolder,
        pinned: false,
        updated: "NOW",
      },
      ...current,
    ]);
    if (filter === "pinned") setFilter("all");
    setSelectedId(nextId);
  };

  const addFolder = () => {
    const cleanName = newFolderName.trim();
    if (!cleanName) return;
    const existingFolder = folders.find(
      (folder) => folder.toLowerCase() === cleanName.toLowerCase(),
    );
    if (existingFolder) {
      setFilter(existingFolder);
    } else {
      setFolders((current) => [...current, cleanName]);
      setFilter(cleanName);
    }
    setNewFolderName("");
    setIsAddingFolder(false);
  };

  const deleteNote = (id: number) => {
    setNotes((current) => current.filter((note) => note.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6cddd] p-3 text-[#5a3043] sm:p-6">
      <div className="pixel-shell mx-auto flex min-h-[calc(100vh-24px)] max-w-[1480px] overflow-hidden bg-[#fff7fa] sm:min-h-[calc(100vh-48px)]">
        <aside className="hidden w-[224px] shrink-0 flex-col border-r-4 border-[#6a3a50] bg-[#f8d9e5] p-5 md:flex">
          <div className="mb-10">
            <div className="pixel-logo mb-3 flex h-12 w-12 items-center justify-center bg-[#ff7eaa]">
              <span className="text-2xl">✦</span>
            </div>
            <h1 className="pixel-title text-[14px] leading-6">PIXEL<br />MEMO</h1>
            <p className="mt-2 font-mono text-[11px] tracking-[0.14em] text-[#9d627a]">
              v.01 / ONLINE
            </p>
          </div>

          <nav className="space-y-3" aria-label="Note filters">
            <button
              className={`side-button ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              <span>[01]</span>
              <span>ALL NOTES</span>
              <span>{String(notes.length).padStart(2, "0")}</span>
            </button>
            <button
              className={`side-button ${filter === "pinned" ? "active" : ""}`}
              onClick={() => setFilter("pinned")}
            >
              <span>[02]</span>
              <span>PINNED</span>
              <span>{String(notes.filter((note) => note.pinned).length).padStart(2, "0")}</span>
            </button>
          </nav>

          <div className="my-5 border-t-2 border-dashed border-[#b87a93]" />
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-[12px] tracking-[0.16em] text-[#8e536c]">
              MY FOLDERS
            </p>
            <button
              aria-label="Create folder"
              className="folder-add"
              onClick={() => setIsAddingFolder((current) => !current)}
            >
              +
            </button>
          </div>
          <nav className="space-y-2" aria-label="Custom folders">
            {folders.map((folder, index) => (
              <button
                className={`folder-button ${filter === folder ? "active" : ""}`}
                key={folder}
                onClick={() => setFilter(folder)}
              >
                <span aria-hidden="true">▰</span>
                <span className="truncate">{folder}</span>
                <span>{String(notes.filter((note) => note.folder === folder).length).padStart(2, "0")}</span>
              </button>
            ))}
            {isAddingFolder && (
              <form
                className="folder-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  addFolder();
                }}
              >
                <input
                  aria-label="New folder name"
                  autoFocus
                  maxLength={18}
                  onChange={(event) => setNewFolderName(event.target.value)}
                  placeholder="FOLDER NAME"
                  value={newFolderName}
                />
                <button aria-label="Save folder" type="submit">OK</button>
              </form>
            )}
          </nav>

          <div className="mt-auto">
            <div className="mb-4 border-2 border-dashed border-[#b87a93] p-3 text-center font-mono text-[11px] leading-5">
              SAVE SMALL THOUGHTS<br />
              BEFORE THEY FLOAT AWAY
            </div>
            <p className="text-center font-mono text-[10px] tracking-widest text-[#a96782]">
              AUTO-SAVED ✓
            </p>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex flex-wrap items-center gap-3 border-b-4 border-[#6a3a50] bg-[#fffafd] px-4 py-4 sm:px-7">
            <div className="md:hidden">
              <p className="pixel-title text-[11px]">PIXEL MEMO</p>
            </div>
            <label className="pixel-search order-3 flex h-11 w-full items-center gap-3 bg-[#f8e5ed] px-3 sm:order-none sm:w-auto sm:min-w-[280px]">
              <PixelIcon type="search" />
              <input
                aria-label="Search notes"
                className="w-full bg-transparent font-mono text-sm uppercase outline-none placeholder:text-[#a66c83]"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="SEARCH MEMORY..."
                value={query}
              />
            </label>
            <div className="ml-auto hidden items-center gap-2 font-mono text-[11px] tracking-widest text-[#986279] lg:flex">
              <span className="h-2 w-2 bg-[#ff6f9f]" />
              MEMORY: {String(notes.length).padStart(2, "0")}/99
            </div>
            <button
              className={`widget-toggle ${showWidget ? "active" : ""}`}
              onClick={() => setShowWidget((current) => !current)}
            >
              <span aria-hidden="true">▣</span>
              WIDGET
            </button>
            <button className="pixel-button ml-auto sm:ml-0" onClick={addNote}>
              <PixelIcon type="plus" />
              NEW NOTE
            </button>
          </header>

          <div className="soft-grid flex-1 overflow-auto p-5 sm:p-8 lg:p-10">
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2 md:hidden">
              {["all", "pinned", ...folders].map((folder) => (
                <button
                  className={`mobile-folder ${filter === folder ? "active" : ""}`}
                  key={folder}
                  onClick={() => setFilter(folder)}
                >
                  {folder.toUpperCase()}
                </button>
              ))}
              <button
                aria-label="Create folder"
                className="mobile-folder add"
                onClick={() => setIsAddingFolder((current) => !current)}
              >
                + FOLDER
              </button>
            </div>
            {isAddingFolder && (
              <form
                className="folder-form mobile mb-6 md:hidden"
                onSubmit={(event) => {
                  event.preventDefault();
                  addFolder();
                }}
              >
                <input
                  aria-label="New folder name"
                  maxLength={18}
                  onChange={(event) => setNewFolderName(event.target.value)}
                  placeholder="NEW FOLDER NAME"
                  value={newFolderName}
                />
                <button type="submit">CREATE</button>
              </form>
            )}
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="mb-2 font-mono text-[11px] tracking-[0.2em] text-[#a2637d]">
                  / DESKTOP / {filter.toUpperCase()}
                </p>
                <h2 className="pixel-title text-lg leading-8 sm:text-2xl">
                  {filter === "pinned"
                    ? "KEEP THESE CLOSE"
                    : filter === "all"
                      ? "HELLO, CUTIE!"
                      : filter.toUpperCase()}
                </h2>
              </div>
              <p className="hidden font-mono text-[11px] tracking-[0.16em] text-[#9b657b] sm:block">
                {filteredNotes.length} FILES FOUND
              </p>
            </div>

            {filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-7 gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
                {filteredNotes.map((note, index) => (
                  <article
                    className={`sticky-note note-${note.color} ${selectedId === note.id ? "selected" : ""}`}
                    key={note.id}
                    onClick={() => setSelectedId(note.id)}
                    style={{ transform: `rotate(${index % 2 === 0 ? "-0.7deg" : "0.7deg"})` }}
                  >
                    <div className="note-tape" aria-hidden="true" />
                    <div className="mb-5 flex items-start justify-between gap-3 border-b-2 border-dashed border-[#81485f]/35 pb-3">
                      <input
                        aria-label="Note title"
                        className="min-w-0 flex-1 bg-transparent font-mono text-lg font-bold lowercase outline-none"
                        onChange={(event) => updateNote(note.id, { title: event.target.value })}
                        onClick={(event) => event.stopPropagation()}
                        value={note.title}
                      />
                      <button
                        aria-label={note.pinned ? "Unpin note" : "Pin note"}
                        className={`note-icon ${note.pinned ? "is-pinned" : ""}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          updateNote(note.id, { pinned: !note.pinned });
                        }}
                      >
                        <PixelIcon type="pin" />
                      </button>
                    </div>
                    <textarea
                      aria-label={`${note.title} content`}
                      className="min-h-32 w-full resize-none bg-transparent font-mono text-[15px] leading-7 outline-none"
                      onChange={(event) => updateNote(note.id, { body: event.target.value })}
                      onClick={(event) => event.stopPropagation()}
                      value={note.body}
                    />
                    <footer className="mt-4 flex items-center justify-between border-t-2 border-dashed border-[#81485f]/25 pt-3">
                      <div className="flex gap-2">
                        {colors.map((color) => (
                          <button
                            aria-label={`Make note ${color}`}
                            className={`color-dot dot-${color} ${note.color === color ? "current" : ""}`}
                            key={color}
                            onClick={(event) => {
                              event.stopPropagation();
                              updateNote(note.id, { color });
                            }}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] tracking-widest text-[#8e5a70]">
                        EDITED {note.updated}
                      </span>
                      <button
                        aria-label="Delete note"
                        className="note-icon delete"
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteNote(note.id);
                        }}
                      >
                        <PixelIcon type="trash" />
                      </button>
                    </footer>
                    <label className="note-folder">
                      <span>FOLDER /</span>
                      <select
                        aria-label={`Folder for ${note.title}`}
                        onChange={(event) => updateNote(note.id, { folder: event.target.value })}
                        onClick={(event) => event.stopPropagation()}
                        value={note.folder}
                      >
                        {folders.map((folder) => (
                          <option key={folder} value={folder}>{folder}</option>
                        ))}
                      </select>
                    </label>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state mx-auto mt-16 max-w-md p-10 text-center">
                <p className="pixel-title mb-5 text-sm">NO NOTES HERE...</p>
                <p className="font-mono text-sm leading-6">Your thoughts must be hiding. Try another search or make a fresh note.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {showWidget && (
        <aside className="desktop-widget" aria-label="Desktop note widget">
          <header className="widget-bar">
            <div className="flex items-center gap-2">
              <span className="widget-status" />
              <span>PIXEL_MEMO.EXE</span>
            </div>
            <button aria-label="Close widget" onClick={() => setShowWidget(false)}>
              ×
            </button>
          </header>
          {widgetNote ? (
            <div className={`widget-note note-${widgetNote.color}`}>
              <div className="widget-meta">
                <span>NOTE {String(widgetIndex % notes.length + 1).padStart(2, "0")}</span>
                <span>{widgetNote.folder.toUpperCase()}</span>
              </div>
              <h3>{widgetNote.title}</h3>
              <p>{widgetNote.body}</p>
              <div className="widget-footer">
                <span>{widgetNote.pinned ? "PINNED / " : ""}{widgetNote.updated}</span>
                <button
                  onClick={() =>
                    setWidgetIndex((current) =>
                      notes.length > 0 ? (current + 1) % notes.length : 0,
                    )
                  }
                >
                  NEXT &gt;
                </button>
              </div>
            </div>
          ) : (
            <div className="widget-empty">NO NOTES TO DISPLAY</div>
          )}
        </aside>
      )}
    </main>
  );
}
