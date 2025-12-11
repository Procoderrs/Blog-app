import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";
import Editor from "../../components/Editor";

export default function AdminUpdatePost() {
  const { id } = useParams(); // post ID
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPost(res.data);
        setTitle(res.data.title);
        setShortDesc(res.data.short_desc);
        setContent(res.data.content);
        setSelectedCategory(res.data.category?._id || "");
        setPreview(res.data.image || null);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchPost();
  }, [id, user]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCategories(res.data || []);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchCategories();
  }, [user]);

  if (!post) return <p>Loading post...</p>;

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("short_desc", shortDesc);
    formData.append("category", selectedCategory);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await api.put(`/posts/update/${post._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });
      alert("Post updated successfully!");
      navigate(-1); // go back to user posts page
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to update post");
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto my-10 bg-purple-50 p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">Update User Post</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded outline-none"
            required
          />
          <input
            type="text"
            placeholder="Short description"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            className="w-full border p-2 rounded outline-none"
            required
          />
          <div>
            <label className="block font-semibold mb-2">Upload image</label>
            <input type="file" onChange={handleImage} />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-40 h-40 object-cover rounded border mt-2"
              />
            )}
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <div>
            <label className="block font-semibold mb-2">Content</label>
            <Editor content={content} onChange={setContent} />
          </div>
          <button className="w-full bg-[#33006F] text-white p-3 rounded font-semibold">
            Update Post
          </button>
        </form>
      </div>
    </>
  );
}
