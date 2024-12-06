// pages/admin/blogs.js
import { useState } from "react";

export default function BlogAdmin() {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const blogData = { title, thumbnail, description, content };

    try {
      const response = await fetch("/api/Blog/getblogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        const newBlog = await response.json();
        setSuccess('Blog created successfully!');
        // Reset form
        setTitle('');
        setThumbnail('');
        setDescription('');
        setContent('');
        alert("Blog created successfully!");
      } else {
        setError('Failed to create blog.');
        alert("Failed to create blog.");
      }
    } 
    catch (error) {
        setError('An error occurred. Please try again.');
     
      alert("An error occurred.");
    }
  };

  return (
    <div className="container">
      <h1>Create a New Blog</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Thumbnail URL:</label>
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Blog...' : 'Create Blog'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}
