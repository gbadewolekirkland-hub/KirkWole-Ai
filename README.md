# KIRKLAND AI – ANIME EDITION

A mobile-friendly anime chatbot website plus an optional WhatsApp Cloud API **private-message** webhook adapter.

## Important WhatsApp limitation

This project does **not** add a bot to an ordinary existing WhatsApp group. Meta's official Groups API is restricted to eligible businesses/accounts and has tight group-size and account requirements. The webhook in `api/whatsapp.js` responds to eligible private messages sent to a WhatsApp Business number. Do not use unofficial WhatsApp Web automation libraries or scan a personal account's QR code for a group bot; they can put the account at risk.

## What you need

- A GitHub account.
- A Vercel account (free hosting tier).
- An OpenAI API key. ChatGPT subscriptions do not include API credit; API usage is billed separately. Keep the key private.
- For WhatsApp private messaging only: a Meta developer/business setup, a WhatsApp Business Platform phone number, access token, phone-number ID, and webhook subscription. Meta eligibility and messaging charges may apply.

If you are under 18, ask a parent/guardian to own and supervise any developer/business account and billing setup. Do not share passwords, API keys, verification codes, or private phone details in chat.

## Deploy the website (phone-friendly)

1. Download and unzip this project.
2. Create a new GitHub repository named `kirkland-ai`.
3. Upload all files and folders from this project to the repository. Keep `api/` and `public/` as folders.
4. Sign in to Vercel and choose **Add New → Project**.
5. Import the `kirkland-ai` GitHub repository.
6. In Vercel Project Settings → Environment Variables, add:
   - `OPENAI_API_KEY` = your API key
   - `OPENAI_MODEL` = `gpt-4.1-mini` (or a model available to your API account)
7. Deploy. Open the Vercel URL and test the chat.

Do not upload `.env` or paste secrets into GitHub. `.env.example` is only a template.

## Configure WhatsApp private messages (optional)

1. In Meta for Developers, create/configure an app with the WhatsApp product and complete the required business/phone setup.
2. In Vercel, add these environment variables:
   - `WHATSAPP_VERIFY_TOKEN` = a long random string you choose
   - `WHATSAPP_ACCESS_TOKEN` = token from Meta
   - `WHATSAPP_PHONE_NUMBER_ID` = the phone number ID shown by Meta
   - `WHATSAPP_API_VERSION` = a currently supported Graph API version
   - Keep `OPENAI_API_KEY` and `OPENAI_MODEL` set too.
3. Redeploy after adding variables.
4. In Meta's WhatsApp webhook settings, set callback URL to `https://YOUR-VERCEL-DOMAIN/api/whatsapp`.
5. Enter the same `WHATSAPP_VERIFY_TOKEN` in Meta and subscribe to the `messages` webhook field.
6. Send a test private message to the WhatsApp Business number.

Meta's dashboard and eligibility rules can change. Follow the current instructions shown in your Meta developer dashboard. This does not connect to your existing group.

## Commands

The assistant understands natural language and the following prompts:
- `!help`
- `!anime`
- `!fact`
- `!quiz`
- `!who Madara`
- `!compare Naruto vs Luffy`
- `!quote`

## Local development

Install Node.js, then run:

```bash
npm install
cp .env.example .env
# Add your private API key to .env
npm run dev
```

Open the local URL shown by Vercel CLI.

## Cost and privacy

- Vercel offers a free tier subject to its current limits.
- OpenAI API calls are not covered by a ChatGPT plan and may cost money.
- Meta WhatsApp pricing/eligibility may apply.
- Do not store group members' data. This starter sends each message to the AI provider for a reply and logs only errors on the server.
