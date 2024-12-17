import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import BlogCard from "@/Components/BlogCard";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [updatedBlog, setUpdatedBlog] = useState({
    title: "",
    description: "",
    content: "",
    thumbnailFile: null,
    thumbnailUrl: "",
    pdf: null,
  });

  // Fetch all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/api/Blog/getblogs");
        setBlogs(res.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Handle Delete Blog
  const handleDeleteBlog = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this blog? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/Blog/blogs/${id}`);
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      alert("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog. Please try again.");
    }
  };

  const openEditModal = (blog) => {
    setCurrentBlog(blog);
    setUpdatedBlog({ 
      title: blog.title, 
      description: blog.description,
      content: blog.content || "",
      thumbnailFile: null,
      thumbnailUrl: blog.thumbnail || "",
      pdf: null,
     });
    setEditModalOpen(true);
  };

  // Handle Edit Blog
  const handleEditBlog = async () => {
    const formData = new FormData();
    if (updatedBlog.title !== currentBlog.title) formData.append("title", updatedBlog.title);
    if (updatedBlog.description !== currentBlog.description)
      formData.append("description", updatedBlog.description);
    if (updatedBlog.content !== currentBlog.content)
      formData.append("content", updatedBlog.content);
    if (updatedBlog.thumbnailFile) formData.append("thumbnail", updatedBlog.thumbnailFile);
    if (updatedBlog.thumbnailUrl && !updatedBlog.thumbnailFile)
      formData.append("thumbnailUrl", updatedBlog.thumbnailUrl);
    if (updatedBlog.pdf) formData.append("pdf", updatedBlog.pdf);

    try {
      const response = await axios.put(`/api/Blog/blogs/${currentBlog._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setBlogs((prev) =>
          prev.map((b) =>
            b._id === currentBlog._id
              ? { ...b, ...response.data.updatedBlog }
              : b
          )
        );
        setEditModalOpen(false);
        alert("Blog updated successfully!");
      } else {
        alert("Failed to update blog.");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("An error occurred while updating the blog.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Page Title */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Manage Blogs</h1>
        <Link legacyBehavior href="/Admin/Blogs/CreateBlogs">
          <h2 className="bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-600 transition">
            + Create Blog
          </h2>
        </Link>
      </div>

      {/* Total Blogs Count */}
      <div className="text-lg font-medium text-gray-700 mb-4">
        Total Blogs:{" "}
        <span className="font-bold text-purple-700">{blogs.length}</span>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-lg text-gray-500 animate-pulse">
          Loading blogs...
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="relative group">
              {/* Reusing BlogCard Component */}
              <BlogCard
                id={blog._id}
                title={blog.title}
                thumbnail={blog.thumbnail}
                likes={blog.likes}
                comments={blog.comments.length}
              />
              {/* Edit and Delete Buttons */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => openEditModal(blog)}
                  className="text-blue-500 hover:text-blue-700 flex items-center"
                >
                  <FaEdit className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteBlog(blog._id)}
                  className="text-red-500 hover:text-red-700 flex items-center"
                >
                  <FaTrashAlt className=" ml-3 mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-lg text-gray-600">
          No blogs found. Click "Create Blog" to add a new blog.
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-4">Edit Blog</h2>
            <div>
              <label>Title</label>
              <input
                type="text"
                value={updatedBlog.title}
                onChange={(e) => setUpdatedBlog({ ...updatedBlog, title: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                value={updatedBlog.description}
                onChange={(e) =>
                  setUpdatedBlog({ ...updatedBlog, description: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label>Content</label>
              <textarea
                value={updatedBlog.content}
                onChange={(e) =>
                  setUpdatedBlog({ ...updatedBlog, content: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label>Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUpdatedBlog({ ...updatedBlog, thumbnailFile: e.target.files[0] })}
                className="w-full mb-2"
              />
              <input
                type="text"
                placeholder="Enter thumbnail URL"
                value={updatedBlog.thumbnailUrl}
                onChange={(e) => setUpdatedBlog({ ...updatedBlog, thumbnailUrl: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label>Upload PDF</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setUpdatedBlog({ ...updatedBlog, pdf: e.target.files[0] })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-400 rounded text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleEditBlog}
                className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
