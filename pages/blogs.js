import axios from 'axios';
import BlogCard from '@/Components/BlogCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState } from 'react';
import HomeNavbar from '@/Components/HomeNavbar';

export default function Home({ initialBlogs }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreBlogs = async () => {
    const res = await axios.get(`/api/Blog/getblogs?skip=${blogs.length}`);
    if (res.data.length === 0) setHasMore(false);
    setBlogs((prev) => [...prev, ...res.data]);
  };

  return (
    <>
      <HomeNavbar />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto">
          <h1 className="text-4xl font-extrabold text-center mb-10 text-purple-800">
            Our Blogs
          </h1>
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
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/Blog/getblogs`
  );
  return { props: { initialBlogs: res.data } };
}
