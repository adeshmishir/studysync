import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { protectRoute } from '../middleware/protectRoute.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/ai/solve - Solve a doubt using Gemini
router.post('/solve', protectRoute, async (req, res) => {
  try {
    const { question, history } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, message: "Question is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format history for Gemini if provided
    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(question);
    const response = await result.response;
    const text = response.text();

    res.json({ success: true, answer: text });
  } catch (err) {
    console.error("❌ AI Error:", err);
    res.status(500).json({ success: false, message: "AI failed to process your request", error: err.message });
  }
});

export default router;
