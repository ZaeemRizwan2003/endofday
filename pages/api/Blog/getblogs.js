import multer from "multer";
import path from "path";
import fs from "fs";
import pdfParse from "pdf-parse";
import dbConnect from "@/middleware/mongoose";
import Blog from "@/models/Blog";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads"); // Ensure this directory exists
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

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser to handle multipart/form-data
  },
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { skip = 0, limit = 10 } = req.query; // Pagination
    try {
      const blogs = await Blog.find({})
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .select("title thumbnail description likes comments pdfUrl");
      return res.status(200).json(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return res.status(500).json({ error: "Failed to fetch blogs" });
    }
  } else if (req.method === "POST") {
    upload.fields([
      { name: "pdf", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ])(req, res, async function (err) {
      if (err) {
        console.error("File upload error:", err);
        return res.status(500).json({ error: "File upload failed." });
      }

      const mode = req.body.mode;
      const title = req.body.title;

      if (!mode) {
        return res.status(400).json({ error: "Mode is required." });
      }

      if (!title) {
        return res.status(400).json({ error: "Title is required." });
      }

      if (mode === "manual") {
        const { description, content } = req.body;
        const thumbnail = req.body.thumbnail;

        if (!description || !content) {
          return res
            .status(400)
            .json({ error: "Description and content are required." });
        }

        try {
          const blog = await Blog.create({
            title,
            thumbnail,
            description,
            content,
          });
          return res.status(201).json(blog);
        } catch (error) {
          console.error("Error creating manual blog:", error);
          return res.status(500).json({ error: "Failed to create blog." });
        }
      } else if (mode === "pdf") {
        const pdfFile = req.files["pdf"]?.[0];
        const thumbnailFile = req.files["thumbnail"]?.[0];
        const thumbnailUrl = req.body.thumbnailUrl;
        const description = req.body.description; 

        if (!pdfFile) {
          return res.status(400).json({ error: "PDF file is required." });
        }

        try {
          const pdfUrl = `/uploads/${pdfFile.filename}`;
          const finalThumbnail = thumbnailFile
            ? `/uploads/${thumbnailFile.filename}`
            : thumbnailUrl;

          const blog = await Blog.create({
            title,
            thumbnail: finalThumbnail,
            description,
            content: null, // No plain content for PDFs
            pdfUrl,
          });

          return res.status(201).json(blog);
        } catch (error) {
          console.error("Error processing PDF blog:", error);
          return res.status(500).json({ error: "Failed to process PDF blog." });
        }
      } else {
        return res.status(400).json({ error: "Invalid mode." });
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
