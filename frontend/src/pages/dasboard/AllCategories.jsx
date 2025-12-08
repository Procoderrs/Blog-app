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
            {categories.map((cat) => (
              <li
                key={cat._id}
                className="flex justify-between items-center bg-purple-50 p-3 rounded shadow"
              >
                <span className="font-semibold">{cat.name}</span>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">You have no categories yet.</p>
        )}
      </div>
    </div>
  );
};

export default AllCategories;
