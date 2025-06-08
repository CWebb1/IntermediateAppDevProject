import { createSignal, createMemo, Show } from "solid-js";

function App() {
  // Load todos from localStorage or start with empty array
  const stored = localStorage.getItem("todos");
  const [todos, setTodos] = createSignal(stored ? JSON.parse(stored) : []);
  const [input, setInput] = createSignal("");
  const [filter, setFilter] = createSignal("all");
  const [editId, setEditId] = createSignal(null);
  const [editText, setEditText] = createSignal("");

  // Save todos to localStorage whenever they change
  const saveTodos = (next) => {
    setTodos(next);
    localStorage.setItem("todos", JSON.stringify(next));
  };

  // Add new todo
  const handleAdd = () => {
    if (!input().trim()) return;
    const next = [
      ...todos(),
      { id: Date.now(), text: input(), completed: false }
    ];
    saveTodos(next);
    setInput("");
  };

  // Delete todo
  const handleDelete = (id) => {
    const next = todos().filter((todo) => todo.id !== id);
    saveTodos(next);
  };

  // Edit todo
  const handleEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  // Save edited todo
  const handleSave = (id) => {
    if (!editText().trim()) return;
    const next = todos().map((todo) =>
      todo.id === id ? { ...todo, text: editText() } : todo
    );
    saveTodos(next);
    setEditId(null);
    setEditText("");
  };

  // Toggle complete/incomplete
  const handleToggle = (id) => {
    const next = todos().map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(next);
  };

  // Filter todos
  const filteredTodos = createMemo(() =>
    todos().filter((todo) => {
      if (filter() === "completed") return todo.completed;
      if (filter() === "incomplete") return !todo.completed;
      return true;
    })
  );

  return (
    <div class="max-w-xl mx-auto py-10">
      <h1 class="text-4xl text-green-700 text-center mb-8 font-bold">Todo App</h1>
      <div class="flex gap-2 mb-6">
        <input
          class="flex-1 border rounded px-3 py-2"
          placeholder="Add a new todo..."
          value={input()}
          onInput={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
      <div class="flex gap-2 mb-4 justify-center">
        <button
          class={`px-3 py-1 rounded ${filter() === "all" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          class={`px-3 py-1 rounded ${filter() === "completed" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          class={`px-3 py-1 rounded ${filter() === "incomplete" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("incomplete")}
        >
          Incomplete
        </button>
      </div>
      <ul class="space-y-2">
        <Show when={filteredTodos().length > 0} fallback={
          <li class="text-center text-gray-500">No todos found.</li>
        }>
          {filteredTodos().map((todo) => (
            <li
              class="flex items-center gap-2 bg-white rounded shadow px-4 py-2"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id)}
                class="accent-green-600"
              />
              {editId() === todo.id ? (
                <>
                  <input
                    class="flex-1 border rounded px-2 py-1"
                    value={editText()}
                    onInput={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSave(todo.id)}
                    autofocus
                  />
                  <button
                    class="text-green-600 hover:underline"
                    onClick={() => handleSave(todo.id)}
                  >
                    Save
                  </button>
                  <button
                    class="text-gray-500 hover:underline"
                    onClick={() => setEditId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span
                    class={`flex-1 ${todo.completed ? "line-through text-gray-400" : ""}`}
                  >
                    {todo.text}
                  </span>
                  <button
                    class="text-blue-600 hover:underline"
                    onClick={() => handleEdit(todo.id, todo.text)}
                  >
                    Edit
                  </button>
                  <button
                    class="text-red-600 hover:underline"
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </Show>
      </ul>
    </div>
  );
}

export default App;
