import { useState, useContext, useEffect } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Editor from "../../components/Editor";
import imageCompression from "browser-image-compression";

export default function AddPost() {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const [categories, setCategories] = useState([]);
	const [title, setTitle] = useState("");
	const [shortDesc, setShortDesc] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [content, setContent] = useState("");
	const [image, setImage] = useState(null);
	const [preview, setPreview] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await api.get("/categories", {
					headers: { Authorization: `Bearer ${user?.token}` },
				});
				setCategories(res.data || []);
			} catch (error) {
				console.log(
					"Fetch categories error:",
					error.response?.data || error.message
				);
			}
		};
		fetchCategories();
	}, [user]);

	const handleImage = async (e) => {
		let file = e.target.files[0];
		if (!file) return;

		if (file.size > 10 * 1024 * 1024) {
			// 10MB
			alert("File is too large. Max size is 10MB.");
			return;
		}

		// Optional: compress image
		const options = {
			maxSizeMB: 2,
			maxWidthOrHeight: 1920,
			useWebWorker: true,
		};
		try {
			const compressedFile = await imageCompression(file, options);
			setImage(compressedFile);
			setPreview(URL.createObjectURL(compressedFile));
			setErrors((prev) => ({ ...prev, image: "" }));
		} catch (err) {
			console.error("Image compression error:", err);
		}
	};

	const validateForm = () => {
		let newErrors = {};
		if (!title.trim()) newErrors.title = "Title is required.";
		if (!shortDesc.trim())
			newErrors.shortDesc = "Short description is required.";
		if (!selectedCategory) newErrors.category = "Category is required.";
		if (!content.trim()) newErrors.content = "Content is required.";
		if (!image) newErrors.image = "Image is required.";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;
		if (!validateForm()) return;

		setIsSubmitting(true);
		const formData = new FormData();
		formData.append("title", title);
		formData.append("short_desc", shortDesc);
		formData.append("content", content);
		formData.append("category", selectedCategory);
		formData.append("image", image);

		try {
			const res = await api.post("/posts/create", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${user?.token}`,
				},
			});
			alert("Post created successfully!");
			navigate("/");
		} catch (err) {
			console.error("Post creation error:", err.response?.data || err.message);
			setErrors({
				submit: err.response?.data?.message || "Failed to create post.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="w-full max-w-4xl mx-auto mt-10 bg-purple-50 p-3 md:p-8 rounded-lg shadow">
			<h1 className="text-3xl font-bold mb-6">Create New Post</h1>

			<form onSubmit={handleSubmit} className="space-y-5">
				<input
					type="text"
					placeholder="Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="w-full border p-2 rounded"
				/>

				<input
					type="text"
					placeholder="Short description"
					value={shortDesc}
					onChange={(e) => setShortDesc(e.target.value)}
					className="w-full border p-2 rounded"
				/>
				<input type="file" accept="image/*" onChange={handleImage} />
				{preview && (
					<img
						src={preview}
						alt="preview"
						className="w-40 h-40 object-cover rounded mt-2"
					/>
				)}
				<select
					value={selectedCategory}
					onChange={(e) => setSelectedCategory(e.target.value)}
					className="w-full border px-3 py-2 rounded"
				>
					<option value="">Select Category</option>
					{categories.map((c) => (
						<option key={c._id} value={c._id}>
							{c.name}
						</option>
					))}
				</select>
				<Editor content={content} onChange={setContent} />
				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full p-3 rounded font-semibold text-white bg-blue-600"
				>
					{isSubmitting ? "Publishing..." : "Publish Post"}
				</button>
				{errors.submit && (
					<p className="bg-red-100 text-red-700 p-3 rounded mt-4">
						{errors.submit}
					</p>
				)}
			</form>
		</div>
	);
}
