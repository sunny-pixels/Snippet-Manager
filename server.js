const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://spanox:spanox@cluster0.tgosqel.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = process.env.DB_NAME || 'code_snippet_manager';

mongoose
  .connect(MONGODB_URI, { dbName: DB_NAME })
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Snippet Schema
const snippetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    code: { type: String, required: true },
    language: { type: String, required: true },
    category: { type: String, default: '' },
    tags: [{ type: String }],
    isFavorite: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Snippet = mongoose.model('Snippet', snippetSchema);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date() });
});

// API Routes
app.get('/api/snippets', async (req, res) => {
  try {
    const snippets = await Snippet.find().sort({ updatedAt: -1 });
    res.json(snippets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/snippets', async (req, res) => {
  try {
    const snippet = new Snippet(req.body);
    const savedSnippet = await snippet.save();
    res.json(savedSnippet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/snippets/:id', async (req, res) => {
  try {
    const snippet = await Snippet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(snippet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/snippets/:id', async (req, res) => {
  try {
    await Snippet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Snippet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
