// RemoteProductService.js

const BASE_URL = "http://unidb.openlab.uninorte.edu.co";
const CONTRACT_KEY = "Todo-tubens-14";
const TABLE = "todo";

//https://unidb.openlab.uninorte.edu.co/e83b7ac8-bdad-4bb8-a532-6aaa5fddefa4/data/products/all?format=json

const TodoService = {
  /**
   * Fetches all products.
   * @returns {Promise<Array<Object>>} resolves to an array of product objects
   */
  async getTodo() {
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/all?format=json`;
    try {
      const response = await fetch(url, { method: "GET" });
      if (response.status !== 200) {
        throw new Error(`Error code ${response.status}`);
      }

      const decoded = await response.json();
      const rawData = decoded.data || [];

      // Flatten each record into { id, ...fields }
      const todos = rawData.map((record) => {
        const { entry_id, data } = record;
        return {
          id: entry_id, // top‐level entry_id becomes your id
          ...data // spread in name, quantity, description, etc.
        };
      });

      console.log("ProductService getProducts ok");
      return todos;
    } catch (err) {
      console.error("getProducts error:", err);
      throw err;
    }
  },

  /**
   * Adds a new product.
   * @param {Object} todo – must match your backend schema
   * @returns {Promise<boolean>} true on 201, false otherwise
   */
  async addTodo(todo) {
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/store`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          table_name: TABLE,
          data: todo
        })
      });

      if (res.status === 200) {
        // Parse the returned JSON
        // const decoded = await res.json();
        // const record = decoded.data; // { entry_id, data: { … } }
        // const { entry_id, data: fields } = record;
        // // Flatten into { id, …fields }
        // const newProduct = { id: entry_id, ...fields };
        //console.log("addProduct →", newProduct);
      } else {
        const text = await res.text();
        console.error(`addProduct failed ${res.status}:`, text);
        return null;
      }
    } catch (err) {
      console.error("addProduct error:", err);
      return null;
    }
  },

  /**
   * Updates an existing product by id.
   * @param {Object} product – must include an `id` field
   * @returns {Promise<boolean>} true on 200
   */
  async updateTodo(todo) {
    if (!todo.id) throw new Error("product.id is required");
    console.log("updateProduct", todo);
    const { id, ...fields } = todo;
    console.log("updateProduct id ", id, "fields", fields);
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/update/${id}`;

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ data: fields })
      });

      console.log(`updateProduct status ${res.status}`);
      if (res.status === 200) {
        return true;
      } else {
        const text = await res.text();
        console.error(`updateProduct failed ${res.status}:`, text);
        return false;
      }
    } catch (err) {
      console.error("updateProduct error:", err);
      return false;
    }
  },

  /**
   * Deletes a product by id.
   * @param {{ id: string } | string} productOrId
   * @returns {Promise<boolean>}
   */
  async deleteTodo(todoOrId) {
    const id = typeof todoOrId === "string" ? todoOrId : todoOrId.id;
    if (!id) throw new Error("product.id is required");
    const url = `${BASE_URL}/${CONTRACT_KEY}/data/${TABLE}/delete/${id}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json; charset=UTF-8" }
      });

      console.log(`deleteProduct status ${res.status}`);
      if (res.status === 200) {
        return true;
      } else {
        const text = await res.text();
        console.error(`deleteProduct failed ${res.status}:`, text);
        return false;
      }
    } catch (err) {
      console.error("deleteProduct error:", err);
      return false;
    }
  },

  /**
   * Deletes *all* products by fetching them and deleting one by one.
   * @returns {Promise<boolean>}
   */
  async deleteTodo() {
    try {
      const all = await this.getTodo();
      for (const p of all) {
        // now accepts either p or p.id
        // eslint-disable-next-line no-await-in-loop
        await this.deleteTodo(p.id);
      }
      return true;
    } catch (err) {
      console.error("deleteProducts error:", err);
      return false;
    }
  }
};

export default TodoService;
