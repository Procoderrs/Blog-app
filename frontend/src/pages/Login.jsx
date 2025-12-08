import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const { data } = await api.post("/auth/login", form);
    login(data); 

    console.log("Login successful:", data);

    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");

    if (redirect) {
      navigate(`/${redirect}`);
      return;
    }

    if (data.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard/posts");
    }

  } catch (err) {
    console.log(err.message);
    alert(err.message);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded">
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
