import dbConnect from '@/middleware/mongoose';
import Blog from '@/models/Blog';
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "public/uploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});


const upload = multer({ storage: storage });
const uploadMiddleware = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
]);

export const config = {
  api: {
    bodyParser: false, // Required for file uploads with Multer
  },
};


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
  } else if (req.method === "DELETE") {
    try {
      const blog = await Blog.findByIdAndDelete(id);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog:", error);
      return res.status(500).json({ error: "Failed to delete blog" });
    }
  } else if (req.method === "PUT") {
    // Update a blog
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        console.error("Error uploading files:", err);
        return res.status(500).json({ error: "File upload failed." });
      }

      const { title, description, content, thumbnailUrl } = req.body;
      const updateData = {};

      try {
        // Conditional field updates
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (content) updateData.content = content;

        // Handle file uploads or external URL
        if (req.files["thumbnail"]?.[0]) {
          updateData.thumbnail = `/uploads/${req.files["thumbnail"][0].filename}`;
        } else if (thumbnailUrl) {
          updateData.thumbnail = thumbnailUrl;
        }

        if (req.files["pdf"]?.[0]) {
          updateData.pdfUrl = `/uploads/${req.files["pdf"][0].filename}`;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
          new: true, // Return the updated document
        });

        if (!updatedBlog) {
          return res.status(404).json({ error: "Blog not found" });
        }

        return res.status(200).json({
          success: true,
          message: "Blog updated successfully",
          updatedBlog,
        });
      } catch (error) {
        console.error("Error updating blog:", error);
        return res.status(500).json({ error: "Failed to update blog" });
      }
    });
  } else {
    res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
