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
    if (!form.email) temp.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      temp.email = "Enter a valid email address.";

    if (!form.password) temp.password = "Password is required.";
    else if (form.password.length < 6)
      temp.password = "Password must be at least 6 characters.";

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
      if (value.trim() !== "") delete newErrors[key];
      return newErrors;
    });
  };

  const isFormValid =
    form.email &&
    form.password &&
    Object.keys(errors).length === 0;

  return (
    <div className="min-h-screen flex bg-[#F5F6FA]">
      {/* Left Side Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <div
          className="fixed inset-y-0 left-0 w-1/2 bg-[#3B3363] flex items-center justify-center overflow-hidden"
        >
          <img
            src="/img-3.jpg"
            alt="Login Illustration"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md space-y-6 z-10 relative"
        >
          <h1 className="text-3xl font-extrabold text-[#3B3363] text-center">
            Login
          </h1>

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
            Login
          </button>

          <p className="text-sm text-gray-500 text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-purple-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
