import AdminLayout from "@/Components/AdminLayout";
import { useState } from "react";

export default function BlogAdmin() {
  const [mode, setMode] = useState("manual");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("mode", mode);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("tags", tags);

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    } else if (thumbnailUrl.trim()) {
      formData.append("thumbnailUrl", thumbnailUrl);
    }

    if (mode === "manual") {
      formData.append("content", content);
    } else if (mode === "pdf" && pdf) {
      formData.append("pdf", pdf);
    } else {
      setError("Please upload a PDF or select manual entry.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/Blog/getblogs", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccess("Blog created successfully!");
        setTitle("");
        setDescription("");
        setContent("");
        setThumbnailUrl("");
        setThumbnailFile(null);
        setPdf(null);
        setCategory("");
        setTags("");
      } else {
        setError("Failed to create blog.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
    <div className="container mx-auto p-6 max-w-3xl">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Create a New Blog
      </h1>

      {/* Mode Selection */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="manual"
              checked={mode === "manual"}
              onChange={() => setMode("manual")}
              className="hidden"
            />
            <span
              className={`px-4 py-2 rounded-full ${
                mode === "manual"
                  ? "bg-purple-700 text-white"
                  : "bg-gray-200 text-gray-700"
              } transition`}
            >
              Manual Entry
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="pdf"
              checked={mode === "pdf"}
              onChange={() => setMode("pdf")}
              className="hidden"
            />
            <span
              className={`px-4 py-2 rounded-full ${
                mode === "pdf"
                  ? "bg-purple-700 text-white"
                  : "bg-gray-200 text-gray-700"
              } transition`}
            >
              Upload PDF
            </span>
          </label>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-lg"
      >
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block font-medium mb-2 text-gray-700"
          >
            Blog Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block font-medium mb-2 text-gray-700"
          >
            Blog Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block font-medium mb-2 text-gray-700"
          >
            Category
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block font-medium mb-2 text-gray-700"
          >
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., Healthy, Vegan, Quick Recipes"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Thumbnail Upload or URL */}
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            Thumbnail
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Upload an image or provide a URL.
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
            className="w-full border rounded-lg px-4 py-2 mb-4"
          />
          <div className="text-center mb-2 font-semibold">OR</div>
          <input
            type="text"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="Enter image URL"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Manual Mode Fields */}
        {mode === "manual" && (
          <div>
            <label
              htmlFor="content"
              className="block font-medium mb-2 text-gray-700"
            >
              Blog Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        )}

        {/* PDF Upload */}
        {mode === "pdf" && (
          <div>
            <label
              htmlFor="pdf"
              className="block font-medium mb-2 text-gray-700"
            >
              Upload Blog PDF
            </label>
            <input
              id="pdf"
              type="file"
              accept=".pdf"
              onChange={(e) => setPdf(e.target.files[0])}
              required
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-600"
            }`}
          >
            {loading ? "Creating Blog..." : "Create Blog"}
          </button>
        </div>
      </form>

      {/* Success & Error Messages */}
      {error && <p className="text-red-600 text-center mt-4">{error}</p>}
      {success && <p className="text-green-600 text-center mt-4">{success}</p>}
    </div>
    </AdminLayout>
  );
}
