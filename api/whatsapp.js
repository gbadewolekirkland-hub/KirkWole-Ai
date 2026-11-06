// WhatsApp Cloud API webhook adapter.
// IMPORTANT: Meta's official Groups API is restricted and does not make this
// endpoint a bot for ordinary existing WhatsApp groups. This adapter handles
// eligible PRIVATE inbound messages to a WhatsApp Business number only.

import OpenAI from "openai";

const SYSTEM = `You are KIRKLAND AI – ANIME EDITION, a friendly anime assistant.
Answer anime questions, recommend shows, explain characters, create quizzes and original anime-style quotes.
Ask before major spoilers. Be respectful and concise. Never provide long copyrighted lyrics or scripts.`;

async function sendWhatsAppText(to, body) {
  const version = process.env.WHATSAPP_API_VERSION || "v23.0";
  const url = `https://graph.facebook.com/${version}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body: String(body).slice(0, 3500) }
    })
  });
  if (!r.ok) throw new Error(`WhatsApp send failed: ${r.status}`);
}

async function answer(text) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const out = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    instructions: SYSTEM,
    input: text,
    max_output_tokens: 300
  });
  return out.output_text || "I couldn't answer that just now. Try again!";
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send("Verification failed");
  }

  if (req.method !== "POST") return res.status(405).send("Method not allowed");
  if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID ||
      !process.env.OPENAI_API_KEY) return res.status(503).send("Webhook not configured");

  try {
    const entries = req.body?.entry || [];
    for (const entry of entries) {
      for (const change of entry.changes || []) {
        const value = change.value || {};
        for (const msg of value.messages || []) {
          // Ignore non-text messages and messages without a sender.
          if (msg.type !== "text" || !msg.from || !msg.text?.body) continue;
          // Only reply to private inbound messages delivered to this business number.
          const reply = await answer(msg.text.body);
          await sendWhatsAppText(msg.from, reply);
        }
      }
    }
    return res.status(200).send("EVENT_RECEIVED");
  } catch (err) {
    console.error("WhatsApp webhook error:", err?.message);
    return res.status(500).send("Webhook error");
  }
}