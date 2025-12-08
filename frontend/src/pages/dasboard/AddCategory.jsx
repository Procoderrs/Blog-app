// src/pages/dashboard/AddCategory.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const AddCategory = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Category name is required");

    try {
      await api.post(
        "/categories",
        { name },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      alert("Category added successfully");
      navigate("/dashboard/categories");
    } catch (err) {
      console.error(err.message);
      alert("Failed to add category",err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header />
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Add New Category</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category Name"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <button className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
