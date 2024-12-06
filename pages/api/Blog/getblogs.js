import dbConnect from '@/middleware/mongoose';
import Blog from '@/models/Blog';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { skip = 0, limit = 10 } = req.query;
    try {
      const blogs = await Blog.find({})
      .skip(parseInt(skip))
      .limit(parseInt(limit));
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blogs' });
    }
  } 
  else if (req.method === 'POST') {
    const { title, thumbnail, description, content } = req.body;

    if (!title || !content || !description) {
      return res.status(400).json({ error: 'Title, description, and content are required' });
    }
  
    try {
      const blog = await Blog.create({ title, thumbnail, description, content });
      res.status(201).json(blog);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create blog' });
    }
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
