import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  console.log('register-render');
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/auth/register", form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 rounded shadow w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Register
        </button>
      </form>
      <p className="text-sm text-gray-600 mt-3">
  Already have an account?{" "}
  <Link to="/login" className="text-blue-600 underline">
    Login
  </Link>
</p>
    </div>
  );
}
