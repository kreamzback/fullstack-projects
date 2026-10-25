import { useState, useEffect } from 'react';
import axios from 'axios';

function TodoList({ token }) {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const authConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/todos', authConfig);
      setTodos(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Impossible to load todos.');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await axios.post('http://localhost:3000/todos', { title }, authConfig);
      setTodos((prev) => [res.data.todo, ...prev]);
      setTitle('');
    } catch (err) {
      setError(err.response?.data?.error || 'Issue within add a new task');
    }
  };

  const handleToggleDone = async (todo) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/todos/${todo.id}`,
        { done: !todo.done },
        authConfig
      );
      setTodos((prev) =>
        prev.map((item) => (item.id === todo.id ? res.data.todo : item))
      );
    } catch (err) {
      setError(err.response?.data?.error || 'Cannot update the task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/todos/${id}`, authConfig);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Cannot delete the task');
    }
  };

  return (
    <div>
      <h2>My Todo List</h2>
      <p className="card-lead">Mark a task done when you finish it, or leave it in progress.</p>
      {error && <p className="alert alert-error">{error}</p>}

      <form className="todo-form" onSubmit={handleAddTodo}>
        <input
          type="text"
          placeholder="New task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="btn-primary" type="submit">Add</button>
      </form>

      {todos.length === 0 ? (
        <p className="empty-state">No tasks yet. Write the first one above.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.done ? 'is-done' : 'in-progress'}`}>
              <button
                type="button"
                className={`todo-marker ${todo.done ? 'done' : 'progress'}`}
                onClick={() => handleToggleDone(todo)}
                aria-pressed={todo.done}
                aria-label={todo.done ? 'Mark as in progress' : 'Mark as done'}
                title={todo.done ? 'Done' : 'In progress'}
              >
                {todo.done ? '✓' : ''}
              </button>
              <div className="todo-copy">
                <span className="todo-title">{todo.title}</span>
                <span className="todo-status">{todo.done ? 'Done' : 'In progress'}</span>
              </div>
              <button className="btn-danger" onClick={() => handleDelete(todo.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
