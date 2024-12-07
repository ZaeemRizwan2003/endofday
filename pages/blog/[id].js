import axios from "axios";
import { useState } from "react";
import HomeNavbar from "@/Components/HomeNavbar";
import { FaThumbsUp, FaCommentAlt } from "react-icons/fa";

export default function BlogPost({ blog }) {
  const [likes, setLikes] = useState(blog.likes || 0);
  const [comments, setComments] = useState(blog.comments || []);
  const [newComment, setNewComment] = useState("");

  const handleLike = async () => {
    try {
      const res = await axios.post("/api/Blog/blogs/like", { id: blog._id });
      setLikes(res.data.likes);
    } catch (error) {
      console.error("Error liking the blog:", error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post("/api/Blog/blogs/comment", {
        id: blog._id,
        data: { user: "Anonymous", comment: newComment },
      });
      setComments(res.data.comments);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <>
      <HomeNavbar />
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="container mx-auto max-w-4xl bg-white shadow-lg rounded-lg p-6">
          {/* Blog Title */}
          <h1 className="text-4xl font-extrabold text-purple-700 text-center mb-4">
            {blog.title}
          </h1>
          {/* Blog Thumbnail */}
          {blog.thumbnail && (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-72 object-cover rounded-lg shadow-sm"
            />
          )}
          {/* Blog Content */}
          <div className="mt-6 text-gray-700 leading-relaxed">
            {blog.content ? (
              <p>{blog.content}</p>
            ) : blog.pdfUrl ? (
              <iframe
                src={blog.pdfUrl}
                className="w-full h-[800px] border rounded-lg shadow-sm"
                title={blog.title}
                frameBorder="0"
              ></iframe>
            ) : (
              <p className="text-center text-gray-500 italic">
                No content available for this blog.
              </p>
            )}
          </div>

          {/* Like Button and Comments Section */}
          <div className="mt-8">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className="flex items-center bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
            >
              <FaThumbsUp className="mr-2" /> Like ({likes})
            </button>

            {/* Comments Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <FaCommentAlt className="mr-2 text-purple-700" /> Comments
              </h2>
              {/* Comments List */}
              <ul className="space-y-4 mt-4">
                {comments.map((c, index) => (
                  <li
                    key={index}
                    className="border-b pb-2 text-gray-700 flex items-start space-x-2"
                  >
                    <div className="font-semibold text-purple-600">
                      {c.user || "Anonymous"}:
                    </div>
                    <div>{c.comment}</div>
                  </li>
                ))}
              </ul>
              {/* Comment Input */}
              <div className="mt-6 flex space-x-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleComment}
                  className="bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const res = await axios.get(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/Blog/blogs/${params.id}`
    );

    if (!res.data) {
      return {
        notFound: true, // Handle case where the blog doesn't exist
      };
    }

    return {
      props: { blog: res.data }, // Pass the blog data to the component
    };
  } catch (error) {
    console.error("Error fetching blog:", error);
    return {
      notFound: true, // Return a not found error if the request fails
    };
  }
}
