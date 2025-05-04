import React, { useEffect, useState, createContext } from "react";
import TodoService from "../services/TodoService.js";


// Create the context
export const TodoContext = createContext({
  todos: [],
  loading: false,
  error: null,
  refreshTodos: () => {},
  createTodo: async (data) => {},
  updateTodo: async (id, data) => {},
  deleteTodo: async (id) => {}
});

// Provider component
export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Initial fetch
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await TodoService.getTodo();
      console.log("fetchTodos", data);
      setTodos(data);
    } catch (err) {
      setError("Failed to fetch Todo.");
      console.error("Failed to fetch Todo:", err);
    } finally {
    
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Create a new Todo
  const createTodo= async (todoData) => {
    setLoading(true);
    try {
      await TodoService.addTodo(todoData);
      fetchTodos();
    } catch (err) {
      setError("Failed to create Todo.");
      console.error("Create Todo failed:", err);
    } finally {
      setLoading(false);
    }
    return null;
  };

  // Update an existing Todo
  const updateTodo = async (Todo) => {
    
    setLoading(true);
    console.log("updateTodo", Todo);
    try {
      //const payload = { id, ...TodoData };
      await TodoService.updateTodo(Todo);
      await fetchTodos();
      //   if (success) {
      //     setTodo((prev) =>
      //       prev.map((p) => (p.id === id ? { id, ...TodoData } : p))
      //     );
      //     return true;
    } catch (err) {
      setError("Failed to update Todo.");
      console.error("Update Todo failed:", err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  // Delete a Todo by id
  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      console.log("deleteTodo", id);
      const success = await TodoService.deleteTodo(id);
      console.log(success)
      if (success) {
        setTodos((prev) => prev.filter((p) => p.id !== id));
        return true;
      }
    } catch (err) {
      console.error("Delete Todo failed:", err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        error,
        refreshTodos: fetchTodos,
        createTodo,
        updateTodo,
        deleteTodo
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
