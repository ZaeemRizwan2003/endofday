const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  thumbnail: String,
  description: String,
  content: String,
  pdfUrl: String,
  likes: { type: Number, default: 0 },
  comments: [
    {
      user: String,
      comment: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
