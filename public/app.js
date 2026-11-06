const form = document.querySelector("#form");
const input = document.querySelector("#prompt");
const send = document.querySelector("#send");
const messages = document.querySelector("#messages");

function addBubble(text, who) {
  const el = document.createElement("article");
  el.className = `bubble ${who}`;
  const p = document.createElement("p");
  p.textContent = text;
  el.appendChild(p);
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
  return el;
}
async function ask(message) {
  addBubble(message, "user");
  const pending = addBubble("Thinking… ⚡", "bot");
  send.disabled = true;
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    pending.querySelector("p").textContent = response.ok ? data.reply : (data.error || "Something went wrong.");
  } catch {
    pending.querySelector("p").textContent = "I couldn't connect. Check your internet and try again.";
  } finally {
    send.disabled = false;
    input.focus();
    messages.scrollTop = messages.scrollHeight;
  }
}
form.addEventListener("submit", e => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  input.value = "";
  ask(value);
});
document.querySelectorAll("[data-prompt]").forEach(button => {
  button.addEventListener("click", () => ask(button.dataset.prompt));
});