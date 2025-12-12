import { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const validate = () => {
    let temp = {};

    if (!form.email) {
      temp.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      temp.email = "Enter a valid email address.";
    }

    if (!form.password) {
      temp.password = "Password is required.";
    } else if (form.password.length < 6) {
      temp.password = "Password must be at least 6 characters.";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const { data } = await api.post("/auth/login", form);
      login(data);

      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect");

      if (redirect) {
        navigate(`/${redirect}`);
        return;
      }

      if (data.role === "admin") navigate("/admin");
      else navigate("/");

    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  const onChangeField = (key, value) => {
  setForm({ ...form, [key]: value });

  setErrors((prev) => {
    const newErrors = { ...prev };

    if (value.trim() !== "") {
      delete newErrors[key];     // remove error key
    }

    return newErrors;
  });
};


  const isFormValid =
    form.email &&
    form.password &&
    Object.keys(errors).length === 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            className={`w-full p-2 border rounded ${
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
        <div>
          <input
            type="password"
            placeholder="Password"
            className={`w-full p-2 border rounded ${
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
          className={`w-full text-white p-2 rounded 
            ${isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"}
          `}
        >
          Login
        </button>

        <p className="text-sm text-gray-600 mt-3 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
