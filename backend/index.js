import express from 'express';
import cors from 'cors';
import multer from 'multer';
import pdf from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import historyRoutes from './routes/history.js';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('📦 MongoDB connected successfully'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
}

// Configure multer for file uploads
const upload = multer({
    dest: uploadsDir,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

// Validate API key on startup
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey === 'your_api_key_here') {
    console.warn('⚠️  WARNING: GEMINI_API_KEY is not set or is using placeholder value!');
    console.warn('⚠️  Please set your API key in the .env file');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(apiKey || 'YOUR_API_KEY_HERE');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);

// API endpoint to process PDF
app.post('/api/process-pdf', upload.single('pdf'), async (req, res) => {
    let filePath = null;

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        filePath = req.file.path;

        // Check if API key is configured
        if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey === 'your_api_key_here') {
            return res.status(500).json({
                error: 'Server configuration error: API key not set. Please contact administrator.'
            });
        }

        // Extract text from PDF
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdf(dataBuffer);
        const pdfText = pdfData.text;

        if (!pdfText || pdfText.trim().length === 0) {
            return res.status(400).json({ error: 'Could not extract text from PDF. The PDF might be empty or image-based.' });
        }

        // Generate summary using Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        // Generate summary
        const summaryPrompt = `You are a helpful study assistant for students. Analyze the following lecture slides/notes and provide a clear, concise summary of the main topics and key points. Make it easy to understand for students studying for exams.

Text from slides:
${pdfText.substring(0, 15000)}

Provide a comprehensive summary (200-300 words) covering the main concepts.`;

        const summaryResult = await model.generateContent(summaryPrompt);
        const summary = summaryResult.response.text();

        // Generate Q&A
        const qaPrompt = `You are a helpful study assistant. Based on the following lecture slides/notes, generate 5 important exam-style questions with detailed answers. Make them challenging but fair for students.

Text from slides:
${pdfText.substring(0, 15000)}

Format your response as a JSON array with this structure:
[
  {
    "question": "Question text here?",
    "answer": "Detailed answer here"
  }
]

Only return the JSON array, nothing else.`;

        const qaResult = await model.generateContent(qaPrompt);
        let qaText = qaResult.response.text();

        // Clean up the response to extract JSON
        qaText = qaText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        let questions;
        try {
            questions = JSON.parse(qaText);
        } catch (parseError) {
            console.warn('Failed to parse AI response as JSON, using fallback questions');
            // Fallback: create questions manually if JSON parsing fails
            questions = [
                {
                    question: "What are the main topics covered in this material?",
                    answer: "Based on the content, the main topics include the key concepts discussed in the slides."
                },
                {
                    question: "What are the key takeaways from this lecture?",
                    answer: "The key takeaways focus on understanding the fundamental principles presented."
                },
                {
                    question: "How can this material be applied in practice?",
                    answer: "This material can be applied by understanding and implementing the concepts discussed."
                }
            ];
        }

        // Return results
        res.json({
            summary,
            questions: Array.isArray(questions) ? questions.slice(0, 5) : questions
        });

    } catch (error) {
        console.error('Error processing PDF:', error);

        // Handle specific error types
        let errorMessage = 'Failed to process PDF. Please try again.';
        if (error.message?.includes('API key')) {
            errorMessage = 'API configuration error. Please check server settings.';
        } else if (error.message?.includes('quota')) {
            errorMessage = 'API quota exceeded. Please try again later.';
        }

        res.status(500).json({
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        // Clean up uploaded file
        if (filePath && fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (cleanupError) {
                console.error('Error cleaning up file:', cleanupError);
            }
        }
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        apiKeyConfigured: !!(apiKey && apiKey !== 'YOUR_API_KEY_HERE' && apiKey !== 'your_api_key_here')
    });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Ready to process PDFs with AI!`);
    console.log(`🔑 API Key configured: ${!!(apiKey && apiKey !== 'YOUR_API_KEY_HERE' && apiKey !== 'your_api_key_here')}`);
});
