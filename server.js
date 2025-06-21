require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const conversationSchema = new mongoose.Schema({
  userId: { type: String },
  conversationId: { type: String, required: true, unique: true },
  turns: [
    {
      turnIndex: Number,
      userPrompt: String,
      chatGptRefinement: String,
      deepSeekRefinement: String,
      qwenRefinement: String,
      grokRefinement: String,
      finalRefinedPrompt: String,
      originalPromptStrengths: [String],
      originalPromptWeaknesses: [String],
      refinedPromptAdvantages: [String],
      improvementSuggestions: [String],
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Conversation = mongoose.model('Conversation', conversationSchema);

// Start a new conversation
app.post('/api/conversation/start', async (req, res) => {
  const {
    userPrompt,
    chatGptRefinement,
    deepSeekRefinement,
    qwenRefinement,
    grokRefinement,
    finalRefinedPrompt,
    originalPromptStrengths,
    originalPromptWeaknesses,
    refinedPromptAdvantages,
    improvementSuggestions,
    userId
  } = req.body;

  if (!userPrompt || !finalRefinedPrompt) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const conversationId = Math.random().toString(36).substr(2, 9);

  const newConversation = new Conversation({
    userId,
    conversationId,
    turns: [
      {
        turnIndex: 1,
        userPrompt,
        chatGptRefinement,
        deepSeekRefinement,
        qwenRefinement,
        grokRefinement,
        finalRefinedPrompt,
        originalPromptStrengths,
        originalPromptWeaknesses,
        refinedPromptAdvantages,
        improvementSuggestions
      }
    ]
  });

  try {
    await newConversation.save();
    res.status(200).json({ conversationId });
  } catch (err) {
    console.error('Error saving new conversation:', err);
    res.status(500).json({ error: 'Failed to start conversation' });
  }
});

// Append a new turn
app.patch('/api/conversation/:id/append', async (req, res) => {
  const {
    userPrompt,
    chatGptRefinement,
    deepSeekRefinement,
    qwenRefinement,
    grokRefinement,
    finalRefinedPrompt,
    originalPromptStrengths,
    originalPromptWeaknesses,
    refinedPromptAdvantages,
    improvementSuggestions
  } = req.body;

  const { id: conversationId } = req.params;

  if (!userPrompt || !finalRefinedPrompt) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const conversation = await Conversation.findOne({ conversationId });
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

    const turnIndex = conversation.turns.length + 1;
    conversation.turns.push({
      turnIndex,
      userPrompt,
      chatGptRefinement,
      deepSeekRefinement,
      qwenRefinement,
      grokRefinement,
      finalRefinedPrompt,
      originalPromptStrengths,
      originalPromptWeaknesses,
      refinedPromptAdvantages,
      improvementSuggestions
    });
    conversation.updatedAt = new Date();

    await conversation.save();
    res.status(200).json({ message: 'Turn appended successfully' });
  } catch (err) {
    console.error('Error appending turn:', err);
    res.status(500).json({ error: 'Failed to append turn' });
  }
});

app.get('/', (req, res) => {
  res.send('Promptwise Conversation API is live!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
