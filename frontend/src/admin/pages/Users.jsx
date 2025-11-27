import { useEffect, useState,useContext } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Users() {
  console.log('users render');
  const [users, setUsers] = useState([]);
  const {user}=useContext(AuthContext)

  useEffect(() => {
    fetchUsers();
  }, []);

 const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(res.data);
      console.log(res.data); // use res.data, not users state
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <p className="mb-4 text-gray-700">
      Total Users: <span className="font-semibold">{users.length}</span>
    </p>

      <div className="space-y-3">
        {users.map((u) => (
          <div
            key={u._id}
            className="p-4 bg-white shadow rounded flex justify-between"
          >
            <div>
              <p className="font-semibold">{u.name}</p>
              <p></p>
              <p className="text-gray-500">{u.email}</p>
            </div>

            <Link
              to={`/admin/users/${u._id}/posts`}
              className="text-blue-600 underline"
            >
              View Posts
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
