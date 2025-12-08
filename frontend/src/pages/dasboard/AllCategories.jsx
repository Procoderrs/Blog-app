// src/pages/dashboard/Categories.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const AllCategories = () => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setCategories(res.data || []);
      console.log(res);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleDelete = async (catId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${catId}` ,{
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      fetchCategories();
    } catch (err) {
      console.error(err.response?.data );
      alert("Failed to delete category",err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header />
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Categories</h1>
          <button
            onClick={() => navigate("/dashboard/add-category")}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Add Category
          </button>
        </div>

        {categories.length > 0 ? (
          <ul className="space-y-3">
            {categories.map(cat => (
  <div key={cat._id} className="flex justify-between items-center p-2 border-b">
    <span>{cat.name}</span>

    {cat.createdBy === user._id ? (
      <div className="flex space-x-3">
        <button
          onClick={() => handleEdit(cat._id)}
          className="text-blue-500"
        >
          Edit
        </button>

        <button
          onClick={() => handleDelete(cat._id)}
          className="text-red-500"
        >
          Delete
        </button>
      </div>
    ) : (
      <span className="text-gray-500 text-sm">Admin category</span>
    )}
  </div>
))}

      </div>
    </div>
  );
};

export default AllCategories;
