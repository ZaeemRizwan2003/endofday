import dbConnect from '@/middleware/mongoose';
import Blog from '@/models/Blog';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const blog = await Blog.findById(id);
      if (!blog) return res.status(404).json({ error: 'Blog not found' });
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch the blog' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
