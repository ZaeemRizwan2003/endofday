import dbConnect from '@/middleware/mongoose';
import Blog from '@/models/Blog';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { id, data } = req.body;

    try {
      const blog = await Blog.findByIdAndUpdate(
        id,
        { $push: { comments: data } },
        { new: true }
      );
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add comment' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
