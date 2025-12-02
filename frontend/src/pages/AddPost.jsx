import { useState, useContext, useEffect } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Editor from '../components/Editor';
import Header from '../components/Header';

export default function AddPost() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [categories, setCategories] = useState([]);        // Array of categories
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/admin/categories", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setCategories(res.data.cats || []); // FIXED: correctly extract array
      } catch (error) {
        console.log("Fetch categories error:", error.response?.data || error.message);
      }
    };
    fetchCategories();
  }, [user]);

  // Image preview
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory) return alert('Please select a category');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('short_desc', shortDesc);
    formData.append('content', content);
    formData.append('category', selectedCategory);
    if (image) formData.append('image', image);

    try {
      await api.post('/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log(title,shortDesc,content,selectedCategory,image);
      alert('Post created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error("Post creation error:", err.response?.data || err.message);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto mt-10 bg-purple-50 p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">Create New Post</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Post title"
            className="w-full border p-2 rounded"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Short description"
            className="w-full border p-2 rounded"
            value={shortDesc}
            required
            onChange={(e) => setShortDesc(e.target.value)}
          />

          {/* Image upload */}
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

          {/* Category dropdown */}
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

          {/* Editor */}
          <div>
            <label className="block font-semibold mb-2">Content</label>
            <Editor content={content} onChange={setContent} />
          </div>

          <button className="w-full bg-blue-600 text-white p-3 rounded font-semibold">
            Publish Post
          </button>
        </form>
      </div>
    </>
  );
}
