import React, { useEffect, useState, createContext } from "react";
import TodoService from "../services/TodoService.js";


// Create the context
export const TodoContext = createContext({
  todos: [],
  loading: false,
  error: null,
  refreshProducts: () => {},
  createProduct: async (data) => {},
  updateProduct: async (id, data) => {},
  deleteProduct: async (id) => {}
});

// Provider component
export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial fetch
  const fetchTodo = async () => {
    setLoading(true);
    try {
      const data = await TodoService.getTodo();
      setTodos(data);
    } catch (err) {
      setError("Failed to fetch products.");
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  // Create a new product
  const createTodo= async (todoData) => {
    setLoading(true);
    try {
      await TodoService.addTodo(todoData);
      fetchTodo();
    } catch (err) {
      setError("Failed to create product.");
      console.error("Create product failed:", err);
    } finally {
      setLoading(false);
    }
    return null;
  };

  // Update an existing product
  const updateTodo = async (product) => {
    setLoading(true);
    try {
      //const payload = { id, ...productData };
      await TodoService.updateTodo(product);
      await fetchTodo();
      //   if (success) {
      //     setProducts((prev) =>
      //       prev.map((p) => (p.id === id ? { id, ...productData } : p))
      //     );
      //     return true;
    } catch (err) {
      setError("Failed to update product.");
      console.error("Update product failed:", err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  // Delete a product by id
  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      const success = await TodoService.deleteTodo(id);
      if (success) {
        setTodos((prev) => prev.filter((p) => p.id !== id));
        return true;
      }
    } catch (err) {
      console.error("Delete product failed:", err);
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
        refreshTodo: fetchTodo,
        createTodo,
        updateTodo,
        deleteTodo
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
