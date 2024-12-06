import axios from 'axios';
import { useState } from 'react';

export default function BlogPost({ blog }) {
  const [likes, setLikes] = useState(blog.likes);
  const [comments, setComments] = useState(blog.comments);
  const [newComment, setNewComment] = useState('');

  const handleLike = async () => {
    try{
    const res = await axios.post('/api/Blog/blogs/like', { id: blog._id});
    setLikes(res.data.likes);
    } 
    catch (error) {
        console.error("Error liking the blog:", error);
  }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    try{
    const res = await axios.post('/api/Blog/blogs/comment', {
      id: blog._id,
      data: { user: 'Anonymous', comment: newComment },
    });
    setComments(res.data.comments);
    setNewComment('');
}
catch (error) {
    console.error("Error posting comment:", error);
}
  };

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-purple-700">{blog.title}</h1>
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="w-full h-72 object-cover rounded-lg mt-6"
        />
        <div className="mt-6 text-gray-700 leading-relaxed">
          <p>{blog.content}</p>
        </div>
        <div className="mt-8">
          <button onClick={handleLike} className="btn-primary">
            Like ({likes})
          </button>
          <div className="mt-4">
            <h2 className="text-2xl font-semibold">Comments</h2>
            <ul className="space-y-4 mt-4">
              {comments.map((c, index) => (
                <li key={index} className="border-b pb-2">
                  <strong>{c.user}:</strong> {c.comment}
                </li>
              ))}
            </ul>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
              className="input mt-4"
            />
            <button onClick={handleComment} className="btn-secondary mt-2">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
    try {
        // Use the correct relative API endpoint, not the MongoDB URI
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/Blog/blogs/${params.id}`);
    
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
