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
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="px-4 sm:px-8 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-2">All Users</h1>
        <p className="mb-6 text-gray-700">
          Total Users: <span className="font-semibold">{users.length}</span>
        </p>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Role</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-purple-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                    {u.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-purple-700 font-semibold">
                    {u.role.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center flex justify-center gap-2">
                    <Link
                      to={`/admin/users/${u._id}/posts`}
                      className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-sm"
                    >
                      View Posts
                    </Link>
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="bg-red-500 text-white cursor-pointer px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete User
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No users found.
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
