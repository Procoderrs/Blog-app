import { useEffect, useState,useContext } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";

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
  
  const deleteUser=async (id)=>{

    if(!confirm('delete this user and all thier posts?'))return;
    try {
      await api.delete(`/admin/users/${id}`,{
        headers:{Authorization:`Bearer ${user.token}`},
      });
      setUsers(users.filter((u)=>u._id !==id));

    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  }
 


  return (
   <div className="min-h-screen bg-gray-100">
  <Header />

  <div className="px-4 sm:px-8 lg:px-14 py-6">
    <h1 className="text-2xl font-bold mb-2">All Users</h1>

    <p className="mb-6 text-gray-700">
      Total Users: <span className="font-semibold">{users.length}</span>
    </p>

    {/* --- Responsive Grid --- */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {users.map((u) => (
        <div
          key={u._id}
          className="bg-white shadow p-5 rounded-xl border border-purple-200 flex flex-col gap-4"
        >
          {/* User Info */}
          <div className="bg-purple-100 p-4 rounded-xl text-center">
            <p className="font-semibold text-lg">{u.name}</p>
            <p className="text-gray-600 text-sm">{u.email}</p>
          </div>

          {/* Role */}
          <div className="bg-purple-100 p-4 rounded-xl text-center">
            <p className="font-bold text-purple-700 text-lg">
              {u.role.toUpperCase()}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              to={`/admin/users/${u._id}/posts`}
              className="bg-purple-600 text-white py-2 px-4 rounded-lg text-center hover:bg-purple-700"
            >
              View Posts
            </Link>

            <button
              onClick={() => deleteUser(u._id)}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
            >
              Delete User
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

  );
}
