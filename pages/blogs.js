import axios from "axios";
import BlogCard from "@/Components/BlogCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect } from "react";
import HomeNavbar from "@/Components/HomeNavbar";

export default function Home({ initialBlogs }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/Blog/categories"); // Create API for fetching categories
        setCategories(res.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const fetchMoreBlogs = async () => {
    const res = await axios.get(`/api/Blog/getblogs?skip=${blogs.length}`);
    if (res.data.length === 0) setHasMore(false);
    setBlogs((prev) => [...prev, ...res.data]);
  };

  const fetchFilteredBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/Blog/getblogs?category=${selectedCategory}&tag=${selectedTag}`
      );
      setBlogs(res.data);
      setHasMore(false);
    } catch (error) {
      console.error("Error fetching filtered blogs:", error);
    }
  };

  return (
    <>
      <HomeNavbar />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto">
          <h1 className="text-4xl font-extrabold text-center mb-6 text-purple-800">
            Our Blogs
          </h1>

          {/* 🛠️ Filters Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Category Dropdown */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Input */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Tag
              </label>
              <input
                type="text"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                placeholder="Enter a tag"
                className="border rounded-lg px-4 py-2"
              />
            </div>

            {/* Apply Filters Button */}
            <div className="flex items-end">
              <button
                onClick={fetchFilteredBlogs}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* 📰 Blog Listing */}
          {loading ? (
            <p className="text-center text-gray-600">Loading blogs...</p>
          ) : (
            <InfiniteScroll
              dataLength={blogs.length}
              next={fetchMoreBlogs}
              hasMore={hasMore}
              loader={<h4 className="text-center">Loading...</h4>}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <BlogCard
                    key={blog._id}
                    id={blog._id}
                    title={blog.title}
                    thumbnail={blog.thumbnail}
                    description={blog.description}
                    likes={blog.likes || 0}
                    comments={blog.comments.length || 0}
                  />
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const res = await axios.get(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/api/Blog/getblogs`
  );
  return { props: { initialBlogs: res.data } };
}
