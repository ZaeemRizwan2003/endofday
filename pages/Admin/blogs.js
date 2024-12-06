import { useState } from "react";

export default function BlogAdmin() {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const blogData = { title, thumbnail, description, content };

    try {
      const response = await fetch("/api/Blog/getblogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        const newBlog = await response.json();
        setSuccess("Blog created successfully!");
        // Reset form
        setTitle("");
        setThumbnail("");
        setDescription("");
        setContent("");
        alert("Blog created successfully!");
      } else {
        setError("Failed to create blog.");
        alert("Failed to create blog.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold text-center mb-6">Create a New Blog</h1>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-gray-700">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-2 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Thumbnail URL */}
        <div>
          <label htmlFor="thumbnail" className="block text-lg font-medium text-gray-700">Thumbnail URL</label>
          <input
            id="thumbnail"
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            required
            className="mt-2 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-lg font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-2 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-lg font-medium text-gray-700">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="mt-2 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={6}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 font-semibold text-white rounded-lg focus:outline-none ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-600 focus:ring-4 focus:ring-purple-300"
            }`}
          >
            {loading ? (
              <div className="animate-spin border-4 border-t-transparent border-purple-500 rounded-full w-6 h-6 mx-auto" />
            ) : (
              "Create Blog"
            )}
          </button>
        </div>
      </form>

      {/* Feedback Messages */}
      {error && (
        <div className="mt-4 text-red-600 p-3 border border-red-400 rounded-md bg-red-50">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 text-green-600 p-3 border border-green-400 rounded-md bg-green-50">
          {success}
        </div>
      )}
    </div>
  );
}
