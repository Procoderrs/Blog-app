import { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function Categories() {
  console.log('category render');
  const [categories, setCategories] = useState([]); // All categories
  const [name, setName] = useState(""); // Input for new category
  const [editingId, setEditingId] = useState(null); // Track category being edited
  const [editingName, setEditingName] = useState(""); // Temp name for edit
  const { user } = useContext(AuthContext); // Admin token

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/admin/categories", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCategories(res.data);
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };

    fetchCategories();
  }, [user]);

  // Create new category
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await api.post(
        "/admin/category",
        { name },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setCategories([...categories, res.data]);
      setName("");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/admin/category/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCategories(categories.filter((c) => c._id !== id));
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // Start editing
  const startEdit = (id, currentName) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  // Save edited category
  const saveEdit = async (id) => {
    if (!editingName.trim()) return;
    try {
      const res = await api.put(
        `/admin/category/${id}`,
        { name: editingName },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setCategories(
        categories.map((c) => (c._id === id ? { ...c, name: res.data.name } : c))
      );
      setEditingId(null);
      setEditingName("");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-purple-900">Categories</h1>

      {/* Create new category */}
      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Category"
          className="border border-gray-300 px-4 py-2 rounded-lg flex-1"
        />
        <button
          type="submit"
          className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition"
        >
          Add
        </button>
      </form>

      {/* Display categories */}
      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((c) => (
            <li
              key={c._id}
              className="bg-white p-3 rounded shadow flex justify-between items-center"
            >
              {editingId === c._id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="border px-2 py-1 rounded flex-1"
                />
              ) : (
                <span>{c.name}</span>
              )}

              <div className="flex gap-2">
                {editingId === c._id ? (
                  <button
                    onClick={() => saveEdit(c._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(c._id, c.name)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => handleDelete(c._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
