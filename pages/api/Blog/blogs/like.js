import dbConnect from '@/middleware/mongoose';
import Blog from '@/models/Blog';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { id } = req.body;

    try {
      const blog = await Blog.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },
        { new: true }
      );
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update likes' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
