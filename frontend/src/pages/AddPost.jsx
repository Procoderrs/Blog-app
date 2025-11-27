// src/pages/AddPost.jsx
import { useState, useContext, useEffect } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import {  useNavigate } from 'react-router-dom';
import Editor from '../components/Editor';
import Header from '../components/Header';

export default function AddPost() {
  console.log('addpost render');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
const [categories, setCategories] = useState([]);  // array of categories
const [selectedCategory, setSelectedCategory] = useState(""); // selected category
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

 useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/categories");
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  fetchCategories();
}, []);


  // Image preview
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit with FormData
  const handleSubmit = async (e) => {
   
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('short_desc', shortDesc);
    formData.append('content', content);
    formData.append("category", selectedCategory);

    if (image) formData.append('image', image);
 if(!categories) return ('please  select a category')
    try {
      await api.post('/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token || user?.jwt || user?.accessToken}`,

        },
      });
      alert('Post created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <>
    <Header/>
    <div className="max-w-4xl mx-auto  mt-10 bg-purple-50 p-8 rounded-lg shadow">
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
          <input type="file" onChange={handleImage} className='' />
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

       

        {/* Tiptap Editor */}
        <div>
          <label className="block font-semibold mb-2 ">Content</label>
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
