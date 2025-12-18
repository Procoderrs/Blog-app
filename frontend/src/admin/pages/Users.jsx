import { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";

export default function Users() {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user and all their posts?")) return;
    try {
      await api.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3F7]">
      <Header />

      <div className="px-4 sm:px-8 lg:px-8 py-6">
        <h1 className="text-2xl font-semibold text-[#3A3350] mb-1">All Users</h1>
        <p className="mb-6 text-gray-600 text-sm">
          Total Users: <span className="font-semibold text-[#3a3350]">{users.length}</span>
        </p>

<div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#3a3350] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide">Posts</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#232938] font-medium">
                    {u.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#232938] font-medium">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
  <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#EDE9FE] text-[#3A3350]">
    {u.role.toUpperCase()}
  </span>
</td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-[#232938] font-medium">
                    {u.posts}
                  </td>

                  
                  <td className="px-6 py-4 whitespace-nowrap text-center flex justify-center gap-2">
                    <Link
                      to={`/admin/users/${u._id}/posts`}
                        className="bg-[#3A3350] text-white px-3 py-1.5 rounded-md hover:bg-[#4B445F] text-sm transition"

                    >
                      View Posts
                    </Link>
                    <button
                      onClick={() => deleteUser(u._id)}
                        className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 text-sm transition"

                    >
                      Delete User
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    Users is Loading
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
