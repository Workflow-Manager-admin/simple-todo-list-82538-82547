import React, { useState, useEffect, useRef } from "react";
import "./App.css";

/**
 * Minimalistic Todo App with add, edit, complete, delete, and filter features.
 * Light theme, primary/accent/secondary palette.
 */

// Color palette - injected into CSS variables if needed
const COLORS = {
  primary: "#1976d2",    // Blue
  secondary: "#424242",  // Dark gray
  accent: "#ffb300",     // Amber
};

const THEME_VARS = `
:root {
  --color-primary: ${COLORS.primary};
  --color-secondary: ${COLORS.secondary};
  --color-accent: ${COLORS.accent};
  --color-bg: #fff;
  --color-bg-alt: #f8f9fa;
  --color-text: #222;
  --color-border: #e0e0e0;
}
`;

if (!document.getElementById("themeVars")) {
  const style = document.createElement("style");
  style.id = "themeVars";
  style.textContent = THEME_VARS;
  document.head.appendChild(style);
}

// Helpers
function uuid() {
  // Simple unique id generator
  return "_" + Math.random().toString(36).substr(2, 9);
}

// Filter status options
const FILTERS = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
};

// PUBLIC_INTERFACE
function App() {
  // Todo: [{id, text, completed}]
  const [todos, setTodos] = useState(() => {
    // Optional: persist in localStorage
    const data = window.localStorage.getItem("todo-list");
    return data ? JSON.parse(data) : [];
  });
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  
  const inputRef = useRef(null);
  const editingInputRef = useRef(null);

  // Save todos in localStorage for demo
  useEffect(() => {
    window.localStorage.setItem("todo-list", JSON.stringify(todos));
  }, [todos]);

  // Focus input on load
  useEffect(() => {
    if (editingId && editingInputRef.current) {
      editingInputRef.current.focus();
    } else if (!editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  // PUBLIC_INTERFACE
  function handleAddTodo(e) {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    setTodos([
      ...todos,
      { id: uuid(), text: value, completed: false }
    ]);
    setInput("");
  }

  // PUBLIC_INTERFACE
  function handleEditTodo(id, text) {
    setEditingId(id);
    setEditingValue(text);
  }

  // PUBLIC_INTERFACE
  function handleSaveEdit(id) {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editingValue.trim() || todo.text } : todo
    ));
    setEditingId(null);
    setEditingValue("");
  }

  // PUBLIC_INTERFACE
  function handleToggleCompleted(id) {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  // PUBLIC_INTERFACE
  function handleDeleteTodo(id) {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  // PUBLIC_INTERFACE
  function filteredTodos() {
    if (filter === FILTERS.ALL) return todos;
    if (filter === FILTERS.ACTIVE) return todos.filter(todo => !todo.completed);
    if (filter === FILTERS.COMPLETED) return todos.filter(todo => todo.completed);
    return todos;
  }

  // PUBLIC_INTERFACE
  function handleKeyPressEdit(e, id) {
    if (e.key === "Enter") handleSaveEdit(id);
    if (e.key === "Escape") {
      setEditingId(null);
      setEditingValue("");
    }
  }

  // PUBLIC_INTERFACE
  function handleClearCompleted() {
    setTodos(todos.filter(todo => !todo.completed));
  }

  // Use env variable for backend endpoint if present (optional/future use)
  // Example: const API_URL = process.env.REACT_APP_API_URL

  return (
    <div className="App" style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <header
        style={{
          background: "var(--color-bg-alt)",
          boxShadow: "0 2px 8px 0 rgba(0,0,0,0.02)",
          padding: "2.5rem 0 1rem 0",
          marginBottom: "24px"
        }}
      >
        <h1 style={{
          margin: 0,
          fontWeight: 800,
          letterSpacing: "-1px",
          color: "var(--color-primary)",
          fontSize: "2.1rem"
        }}>
          Simple Todo
        </h1>
        <p style={{
          color: "var(--color-secondary)",
          marginTop: "5px",
          fontSize: ".96rem",
          fontWeight: 500
        }}>
          Organize your tasks, minimal yet powerful
        </p>
      </header>

      <main style={{
        maxWidth: "430px",
        margin: "0 auto",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 12px 0 rgba(34,34,34,0.03), 0 1px 4px 0 rgba(0,0,0,0.025)",
        padding: "28px 16px 24px 16px"
      }}>
        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Add new todo…"
            aria-label="Add new todo"
            style={{
              flex: 1,
              border: "1.5px solid var(--color-border)",
              outline: "none",
              borderRadius: "7px",
              fontSize: "1.02rem",
              padding: "0.7rem 0.9rem"
            }}
            maxLength={140}
          />
          <button
            type="submit"
            title="Add todo"
            aria-label="Add"
            style={{
              background: "var(--color-accent)",
              color: "#fff",
              border: "none",
              borderRadius: "7px",
              padding: "0.7rem 1.1rem",
              fontWeight: 800,
              letterSpacing: "0.02em",
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 0.5px 1.5px rgba(100,100,100,0.09)",
              transition: "background 0.23s"
            }}
            disabled={!input.trim()}
          >
            +
          </button>
        </form>

        {/* Todo List */}
        <ul style={{
          listStyle: "none",
          margin: "28px 0 0 0",
          padding: 0
        }}>
          {filteredTodos().length === 0 &&
            <li style={{
              color: "#aaa",
              textAlign: "center",
              fontStyle: "italic",
              marginTop: "25px"
            }}>
              <small>No todos found for this filter.</small>
            </li>
          }
          {filteredTodos().map(todo => (
            <li key={todo.id} style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 5px",
              borderBottom: "1px solid var(--color-border)"
            }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleCompleted(todo.id)}
                tabIndex={0}
                style={{
                  accentColor: "var(--color-accent)",
                  width: "19px",
                  height: "19px",
                  marginRight: "7px"
                }}
                aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
              />
              {editingId === todo.id ? (
                <input
                  ref={editingInputRef}
                  type="text"
                  value={editingValue}
                  onChange={e => setEditingValue(e.target.value)}
                  onBlur={() => handleSaveEdit(todo.id)}
                  onKeyDown={(e) => handleKeyPressEdit(e, todo.id)}
                  style={{
                    flex: 1,
                    fontSize: "1.01rem",
                    border: "1.5px solid var(--color-border)",
                    borderRadius: "7px",
                    padding: "0.55rem 0.85rem",
                    outline: "none"
                  }}
                  maxLength={140}
                  aria-label="Edit todo"
                />
              ) : (
                <span style={{
                  flex: 1,
                  fontSize: "1.04rem",
                  textDecoration: todo.completed ? "line-through" : undefined,
                  color: todo.completed ? "var(--color-secondary)" : "#222",
                  wordBreak: "break-word",
                  padding: "0 0.3rem",
                  cursor: "pointer"
                }}
                  tabIndex={0}
                  onDoubleClick={() => handleEditTodo(todo.id, todo.text)}
                  title="Double click to edit"
                  aria-label={todo.text + (todo.completed ? ", completed" : '')}
                >
                  {todo.text}
                </span>
              )}
              {/* Edit button */}
              <button
                onClick={() =>
                  editingId === todo.id
                    ? handleSaveEdit(todo.id)
                    : handleEditTodo(todo.id, todo.text)
                }
                style={{
                  marginLeft: "0.7rem",
                  background: "transparent",
                  border: "none",
                  color: "var(--color-accent)",
                  fontSize: "18px",
                  cursor: "pointer",
                  padding: "2px 10px"
                }}
                aria-label={editingId === todo.id ? "Save" : "Edit"}
                title={editingId === todo.id ? "Save" : "Edit"}
              >
                {editingId === todo.id ? (
                  <span role="img" aria-label="Save">&#10003;</span>
                ) : (
                  <span role="img" aria-label="Edit">&#9998;</span>
                )}
              </button>
              {/* Delete button */}
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                style={{
                  marginLeft: "2px",
                  background: "transparent",
                  border: "none",
                  color: "var(--color-secondary)",
                  fontSize: "18px",
                  cursor: "pointer",
                  padding: "2px 10px"
                }}
                aria-label="Delete"
                title="Delete"
              >
                <span role="img" aria-label="Delete">&#128465;</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Controls: Filter/clear */}
        <footer style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "24px",
          gap: "8px",
          flexWrap: "wrap"
        }}>
          <div>
            {Object.entries(FILTERS).map(([key, value]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                style={{
                  background: filter === value ? "var(--color-primary)" : "var(--color-bg)",
                  color: filter === value ? "#fff" : "var(--color-primary)",
                  border: `1.2px solid var(--color-primary)`,
                  borderRadius: "5px",
                  padding: "4.5px 13px",
                  fontSize: ".97rem",
                  marginRight: "7px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.22s"
                }}
                aria-pressed={filter === value}
              >
                {key[0].toUpperCase() + key.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <button
            onClick={handleClearCompleted}
            disabled={todos.every(todo => !todo.completed)}
            style={{
              background: "var(--color-secondary)",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "4.5px 13px",
              fontSize: ".97rem",
              fontWeight: 600,
              opacity: todos.some(todo => todo.completed) ? 1 : 0.7,
              cursor: todos.some(todo => todo.completed) ? "pointer" : "not-allowed"
            }}
            aria-disabled={todos.every(todo => !todo.completed)}
            aria-label="Clear completed"
          >
            Clear completed
          </button>
        </footer>
      </main>
      {/* Instructions about using env for future endpoint configuration */}
      {/* To use a backend, set REACT_APP_API_URL in .env and use process.env.REACT_APP_API_URL */}
    </div>
  );
}

export default App;
