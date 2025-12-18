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

        // Filter out deleted user categories
        const filtered = res.data.filter(
          (cat) => cat.createdByRole === "admin" || cat.createdBy
        );

        setCategories(filtered);
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
      // Remove deleted category from list
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f3f7] p-4">
      <Header />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 text-[#3a3350]">Manage Categories</h1>

        {/* Add Category */}
        <form onSubmit={handleCreate} className="mb-6 flex gap-2 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New category"
  className="border border-gray-300 px-3 py-2 rounded-lg flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A3350]/30"
          />
          <button
            type="submit"
              className="bg-[#3A3350] cursor-pointer text-white px-5 py-2 rounded-lg hover:bg-[#4B445F] text-sm transition"

          >
            Add
          </button>
        </form>

        {/* Category List */}
        {categories.length === 0 ? (
         <p className="text-sm text-gray-500 bg-white p-6 rounded-xl border border-gray-200 text-center">
  categories is Loading
</p>

        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat._id}
                  className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center hover:shadow-md transition"

              >
                {editingId === cat._id ? (
                  <input
  value={editingName}
  onChange={(e) => setEditingName(e.target.value)}
  className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm flex-1 mr-2 focus:ring-2 focus:ring-[#3A3350]/30"
/>
                ) : (
                  <span className="font-medium text-[#2E2938]">{cat.name}</span>
                )}

                <div className="flex gap-2">
                  {/* Role span */}
                  <span
  className={`text-xs font-semibold px-3 py-1 rounded-full ${
    cat.createdByRole === "admin"
      ? "bg-[#EDE9FE] text-[#3A3350]"
      : "bg-gray-100 text-gray-600"
  }`}
>
  {cat.createdByRole === "admin" ? "Admin" : "User"}
</span>


                  {/* Update button */}
                  {(user.role === "admin" || cat.createdBy === user._id) && (
                    editingId === cat._id ? (
                      <button
  onClick={() => saveEdit(cat._id)}
  className="bg-[#3A3350] text-white px-3 py-1.5 text-sm rounded-md hover:bg-[#4B445F]"
>
  Save
</button>

                    ) : (
                     <button
  onClick={() => startEdit(cat._id, cat.name)}
  className="bg-[#3A3350] cursor-pointer text-white px-3 py-1.5 text-sm rounded-md hover:bg-[#4B445F] transition"
>
  Edit
</button>

                    )
                  )}

                  {/* Delete button */}
                  {(user.role === "admin" || cat.createdBy === user._id) && (
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="bg-red-600 cursor-pointer text-white px-3 py-1 text-sm rounded hover:bg-red-700"
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
