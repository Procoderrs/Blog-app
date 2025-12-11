import { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const { user } = useContext(AuthContext);

  // Fetch all categories (admin + users)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setCategories(res.data);
      } catch (err) {
        console.log("Fetch categories error:", err.response?.data || err.message);
      }
    };
    fetchCategories();
  }, [user]);

  // Create new category (admin can create global categories)
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await api.post(
        "/categories",
        { name },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setCategories([...categories, res.data]);
      setName("");
    } catch (err) {
      console.log(err.response?.data || err.message);
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
        `/categories/${id}`,
        { name: editingName },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setCategories(categories.map(c => (c._id === id ? { ...c, name: res.data.name } : c)));
      setEditingId(null);
      setEditingName("");
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Header />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-purple-900">Manage Categories</h1>

        {/* Add Category */}
        <form onSubmit={handleCreate} className="mb-5 flex gap-2 bg-white p-3 rounded-xl shadow">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New category"
            className="border border-gray-300 px-3 py-2 rounded-lg flex-1 text-sm"
          />
          <button
            type="submit"
            className="bg-purple-700 text-white px-5 py-2 rounded-lg hover:bg-purple-800 text-sm"
          >
            Add
          </button>
        </form>

        {/* Category List */}
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories available.</p>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-white p-3 rounded-xl shadow flex justify-between items-center hover:shadow-md transition"
              >
                {editingId === cat._id ? (
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="border px-2 py-1 rounded text-sm flex-1 mr-2"
                  />
                ) : (
                  <span className="font-medium text-gray-800">{cat.name}</span>
                )}

               <div className="flex gap-2">
  {/* Update button */}
  {(user.role === "admin" || cat.createdBy === user._id) && (
    editingId === cat._id ? (
      <button
        onClick={() => saveEdit(cat._id)}
        className="bg-purple-700 text-white px-3 py-1 text-sm rounded hover:bg-purple-800"
      >
        Save
      </button>
    ) : (
      <button
        onClick={() => startEdit(cat._id, cat.name)}
        className="bg-purple-500 text-white px-3 py-1 text-sm rounded hover:bg-purple-400"
      >
        Edit
      </button>
    )
  )}

  {/* Delete button */}
  {(user.role === "admin" || cat.createdBy === user._id) && (
    <button
      onClick={() => handleDelete(cat._id)}
      className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
    >
      Delete
    </button>
  )}

  {/* User-created label */}
  {cat.createdBy && cat.createdBy !== user._id && (
    <span className="text-gray-400 text-sm">User</span>
  )}
</div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
