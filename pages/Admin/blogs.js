import { useState } from "react";

export default function BlogAdmin() {
  const [mode, setMode] = useState("manual"); // 'manual' or 'pdf'
  const [title, setTitle] = useState(""); // For both modes
  const [description, setDescription] = useState(""); // For both modes
  const [content, setContent] = useState(""); // Manual mode only
  const [thumbnailUrl, setThumbnailUrl] = useState(""); // Optional URL for thumbnail
  const [thumbnailFile, setThumbnailFile] = useState(null); // Optional file for thumbnail
  const [pdf, setPdf] = useState(null); // For PDF upload
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("mode", mode);
    formData.append("title", title); // Title is required for both modes
    formData.append("description", description); // Description is required for both modes

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile); // Add thumbnail file if provided
    } else if (thumbnailUrl.trim()) {
      formData.append("thumbnailUrl", thumbnailUrl); // Add thumbnail URL if provided
    }

    if (mode === "manual") {
      formData.append("content", content); // Add content for manual mode
    } else if (mode === "pdf" && pdf) {
      formData.append("pdf", pdf); // Add the PDF file
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
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold text-center mb-6">Create a New Blog</h1>

      {/* Mode Selection */}
      <div className="mb-6">
        <label className="text-lg font-medium mr-4">Choose Mode:</label>
        <label className="mr-4">
          <input
            type="radio"
            value="manual"
            checked={mode === "manual"}
            onChange={() => setMode("manual")}
            className="mr-2"
          />
          Manual Entry
        </label>
        <label>
          <input
            type="radio"
            value="pdf"
            checked={mode === "pdf"}
            onChange={() => setMode("pdf")}
            className="mr-2"
          />
          Upload PDF
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-gray-700">
            Blog Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-lg font-medium text-gray-700">
            Blog Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Thumbnail Upload or URL */}
        <div>
          <label className="block text-lg font-medium text-gray-700">Thumbnail</label>
          <p className="text-sm text-gray-500 mt-1">You can either upload an image or provide a URL.</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
          <p className="text-sm text-gray-500 text-center my-2">OR</p>
          <input
            type="text"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="Enter image URL"
            className="mt-2 w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Manual Mode Fields */}
        {mode === "manual" && (
          <div>
            <label htmlFor="content" className="block text-lg font-medium text-gray-700">
              Blog Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
              className="mt-2 w-full px-4 py-2 border rounded-lg"
            />
          </div>
        )}

        {/* PDF Upload (for PDF Mode Only) */}
        {mode === "pdf" && (
          <div>
            <label htmlFor="pdf" className="block text-lg font-medium text-gray-700">
              Upload Blog PDF
            </label>
            <input
              id="pdf"
              type="file"
              accept=".pdf"
              onChange={(e) => setPdf(e.target.files[0])}
              required
              className="mt-2 w-full px-4 py-2 border rounded-lg"
            />
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 font-semibold text-white rounded-lg ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-600"
            }`}
          >
            {loading ? "Creating Blog..." : "Create Blog"}
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </div>
  );
}
