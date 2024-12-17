import Link from 'next/link';
import { FaRegHeart, FaRegCommentDots } from 'react-icons/fa';

const BlogCard = ({ id, title, thumbnail, description, likes, comments }) => {
  return (
    <Link legacyBehavior href={`/blog/${id}`}>
    <div className="group bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Thumbnail */}
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {/* Blog Info */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
          {title}
        </h2>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center mt-4">
          <Link legacyBehavior href={`/blog/${id}`}>
            <a className="text-purple-700 text-sm font-semibold hover:underline">
              Read More
            </a>
          </Link>
          <div className="flex space-x-4 text-gray-500 text-sm">
            <div className="flex items-center space-x-1">
              <FaRegHeart />
              <span>{likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaRegCommentDots />
              <span>{comments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default BlogCard;
