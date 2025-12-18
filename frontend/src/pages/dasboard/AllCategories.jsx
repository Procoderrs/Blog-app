import { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";

export default function AllCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const { user } = useContext(AuthContext);

  // Fetch all categories (admin + user)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setCategories(res.data); // res.data already filtered by backend
      } catch (err) {
        console.log("Fetch categories error:", err.response?.data || err.message);
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
    <div className="min-h-screen bg-[#f5f6fa] p-4">
      <Header />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-[#3b3363] tracking-tight">Categories</h1>

        {/* Add Category */}
        <form onSubmit={handleCreate} className="mb-6 flex gap-3 bg-white p-4 rounded-2xl shadow-sm">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New category"
            className="border border-[#e5e7eb] px-3 py-2.5 rounded-lg flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c6ee6]/40"
          />
          <button
            type="submit"
            className="bg-[#7c6ee6]  cursor-pointer text-white px-5 font-medium py-2.5 rounded-lg hover:bg-[#6a5be2] text-sm"
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
                className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center hover:shadow-md transition"
              >
                {/* Editable or plain name */}
                {editingId === cat._id ? (
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
className="border border-[#E5E7EB] px-3 py-2 rounded-lg text-sm flex-1 mr-2 focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]/40"
                  />
                ) : (
                  <span className="font-medium text-sm text-[#3b3363]">{cat.name}</span>
                )}

                <div className="flex gap-2">
                  {/* Only user-owned categories are editable */}
                  {cat.createdBy === user._id ? (
                    editingId === cat._id ? (
                      <button
                        onClick={() => saveEdit(cat._id)}
                        className="bg-[#7C6EE6] hover:bg-[#6A5BE2] transition text-white px-3 py-1.5 text-sm rounded-lg"

                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(cat._id, cat.name)}
                        className="bg-[#7C6EE6] hover:bg-[#6A5BE2] transition text-white px-3 py-1.5 text-sm rounded-lg"


                      >
                        Edit
                      </button>
                    )
                  ) : (
                    <span className="text-[#6b7280] text-xs font-medium">Admin</span>
                  )}

                  {/* Only user-owned categories are deletable */}
                  {cat.createdBy === user._id && (
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="bg-red-500 text-white transition px-3 py-1.5 text-sm rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
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
