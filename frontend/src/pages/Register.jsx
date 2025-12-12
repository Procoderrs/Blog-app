import { useState, useContext } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email.";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const { data } = await api.post("/auth/register", form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      console.log(err.response?.data);

      const serverErr = err.response?.data?.message || "Registration failed.";
      setErrors((prev) => ({ ...prev, server: serverErr }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Register</h1>

        {/* Server Error */}
        {errors.server && (
          <p className="text-red-600 text-center text-sm">{errors.server}</p>
        )}

        {/* Name */}
        <input
          type="text"
          placeholder="Name"
          className={`w-full p-2 border rounded ${
            errors.name ? "border-red-500" : ""
          }`}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name}</p>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className={`w-full p-2 border rounded ${
            errors.email ? "border-red-500" : ""
          }`}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email}</p>
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className={`w-full p-2 border rounded ${
            errors.password ? "border-red-500" : ""
          }`}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {errors.password && (
          <p className="text-red-600 text-sm">{errors.password}</p>
        )}

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Register
        </button>

        <p className="text-sm text-gray-600 mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
