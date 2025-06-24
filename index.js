const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Моковые новости (будут заменяться на реальные при подключении источников)
const news = [
  { id: 1, title: "Bitcoin hits $85,000 ATH!", description: "Massive institutional inflows push Bitcoin to new highs.", aiStatus: "✅ Verified" },
  { id: 2, title: "Ethereum 2.0 fully deployed!", description: "Scalability upgrade successfully launched.", aiStatus: "✅ Verified" },
  { id: 3, title: "Regulators investigate new DeFi project", description: "SEC looking into compliance of new DeFi platform.", aiStatus: "⚠️ Questionable" }
];

// Премиум аналитика
const analytics = {
  gold: "$2,375",
  silver: "$29.85",
  platinum: "$1,020",
  palladium: "$1,410",
  sp500: "5,310"
};

// API роуты:
app.get("/api/news", (req, res) => {
  res.json(news);
});

app.get("/api/analytics", (req, res) => {
  res.json(analytics);
});

app.post("/api/verify", async (req, res) => {
  const { text } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a crypto news verifier. Analyze and give confidence score 0-100%." },
        { role: "user", content: text }
      ]
    });
    res.json({ result: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).send("OpenAI error");
  }
});

app.get("/", (req, res) => {
  res.send("GoGoAI Backend is running.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
