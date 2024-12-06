import Link from 'next/link';

const BlogCard = ({ id, title, thumbnail, description }) => {
  return (
    <div className="group relative rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform">
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
      <div className="absolute bottom-0 p-4 text-white">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm line-clamp-2">{description}</p>
        <Link href={`/blog/${id}`}>
          <button className="mt-2 text-sm font-medium underline">
            Read More
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
