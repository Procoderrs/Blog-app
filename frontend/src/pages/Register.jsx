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
      const serverErr = err.response?.data?.message || "Registration failed.";
      setErrors((prev) => ({ ...prev, server: serverErr }));
    }
  };

  const onChangeField = (key, value) => {
    setForm({ ...form, [key]: value });
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (value.trim() !== "") delete newErrors[key];
      return newErrors;
    });
  };

  const isFormValid =
    form.name &&
    form.email &&
    form.password &&
    Object.keys(errors).length === 0;

  return (
    <div className="min-h-screen flex bg-[#F5F6FA]">
      {/* Left Side Form */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-8 z-10 relative">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md space-y-6"
        >
          <h1 className="text-3xl font-extrabold text-[#3B3363] text-center">
            Register
          </h1>

          {/* Server Error */}
          {errors.server && (
            <p className="text-red-600 text-sm text-center">{errors.server}</p>
          )}

          {/* Name */}
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Name"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]/40 transition ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              value={form.name}
              onChange={(e) => onChangeField("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <input
              type="email"
              placeholder="Email"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]/40 transition ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={form.email}
              onChange={(e) => onChangeField("email", e.target.value)}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <input
              type="password"
              placeholder="Password"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]/40 transition ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              value={form.password}
              onChange={(e) => onChangeField("password", e.target.value)}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            disabled={!isFormValid}
            className={`w-full text-white p-3 rounded-lg font-semibold transition ${
              isFormValid
                ? "bg-[#7C6EE6] hover:bg-[#6A5BE2]"
                : "bg-[#22223b] opacity-50 cursor-not-allowed"
            }`}
          >
            Register
          </button>

          <p className="text-sm text-gray-500 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* Right Side Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="fixed inset-y-0 right-0 w-1/2 bg-[#3B3363] flex items-center justify-center overflow-hidden">
          <img
            src="/img-3.jpg"
            alt="Register Illustration"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
