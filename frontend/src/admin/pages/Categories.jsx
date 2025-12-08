import { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";

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
      const res = await api.get("/categories", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setCategories(res.data.cats || []); // FIXED: correctly extract array
    } catch (err) {
      console.log("Fetch categories error:", err.response?.data || err.message);
    }
  };
    fetchCategories();
    console.log(user);
  }, [user]);

  // Create new category
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await api.post(
        "/category",
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
      await api.delete(`/category/${id}`, {
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
  <div className="min-h-screen bg-gray-100 p-4">
    <Header />

    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-purple-900">Manage Categories</h1>

      {/* Create Category */}
      <form
        onSubmit={handleCreate}
        className="mb-5 flex gap-2 bg-white p-3 rounded-xl shadow"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="border border-gray-300 px-3 py-2 rounded-lg flex-1 text-sm"
        />

        <button
          type="submit"
          className="bg-purple-700 text-white px-5 py-2 rounded-lg hover:bg-purple-800 text-sm"
        >
          Add
        </button>
      </form>

      {/* Categories List */}
      {categories.length === 0 ? (
        <p className="text-gray-500 text-sm">No categories available.</p>
      ) : (
        <div className="space-y-3">
          {categories.map((c) => (
            <div
              key={c._id}
              className="bg-white p-3 rounded-xl shadow flex justify-between items-center hover:shadow-md transition"
            >
              {/* Name or Edit Input */}
              {editingId === c._id ? (
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="border px-2 py-1 rounded text-sm flex-1 mr-2"
                />
              ) : (
                <span className="font-medium text-gray-800">{c.name}</span>
              )}

              <div className="flex gap-2">
                {editingId === c._id ? (
                  <button
                    onClick={() => saveEdit(c._id)}
                    className="bg-purple-700 text-white px-3 py-1 text-sm rounded hover:bg-purple-800"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(c._id, c.name)}
                    className="bg-purple-500 text-white px-3 py-1 text-sm rounded hover:bg-purple-400"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => handleDelete(c._id)}
                  className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

}
