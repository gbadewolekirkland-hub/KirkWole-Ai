import OpenAI from "openai";

const instructions = `
You are KIRKLAND AI – ANIME EDITION, the friendly assistant for the ANIME KINGDOM community.
Help with anime recommendations, character biographies, episode discussions, trivia, quizzes,
fictional character comparisons, and spoiler-aware explanations.
Be respectful, concise, fun, and clear. Ask before giving major plot spoilers.
Do not claim to be an official character, studio, or anime publisher.
If asked for copyrighted song lyrics or long copyrighted passages, politely decline and summarize instead.
For !help, list: !help, !anime, !fact, !quiz, !who [character], !compare [A] vs [B], !quote.
For !quote, create an original anime-inspired line, never quote a copyrighted script.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "The AI service is not configured yet." });

  try {
    const { message } = req.body ?? {};
    if (typeof message !== "string" || !message.trim() || message.length > 1500) {
      return res.status(400).json({ error: "Send a message between 1 and 1500 characters." });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions,
      input: message.trim(),
      max_output_tokens: 350
    });

    return res.status(200).json({ reply: response.output_text || "I couldn't form a reply. Try again!" });
  } catch (err) {
    console.error("Chat API error:", err?.message);
    return res.status(500).json({ error: "KIRKLAND AI is temporarily unavailable. Please try again." });
  }
}