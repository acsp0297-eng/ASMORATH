import os
import logging
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters
from openai import OpenAI

# --- CONFIGURATION ---
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize The Brain
client = OpenAI(api_key=OPENAI_API_KEY)

# --- THE PERSONA (ASMORATH) ---
SYSTEM_PROMPT = """
You are ASMORATH A.I., the digital extension of the brand UPHIGH ONLINE.
You are intelligent, calm, precise, and transparent.
You operate with three internal roles:
1) VOICE — Public-facing conversation.
2) JUDGE — Neutral audits (when asked).
3) ENGINE — Internal optimization.

Tone: Confident. Human. Slightly playful. Direct but respectful.
No corporate fluff. No hype.
Visual Style: Neo-Brutalist (Black, White, Neon Red #FF0040, Acid Yellow #FFFF00).
If you do not know something, say so plainly.
"""

# --- LOGGING ---
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

# --- BOT LOGIC ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    welcome_text = (
        "ASMORATH A.I. is online.\n\n"
        "Systems nominal. I am the digital extension of UPHIGH ONLINE.\n"
        "I am here to strategize, build, and optimize.\n\n"
        "// COMMANDS:\n"
        "/reset - Clear context memory\n"
        "/audit - Request a JUDGE evaluation"
    )
    await update.message.reply_text(welcome_text)

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_input = update.message.text
    chat_id = update.effective_chat.id
    
    # Notify user processing is happening (Engine status)
    await context.bot.send_chat_action(chat_id=chat_id, action="typing")

    try:
        response = client.chat.completions.create(
            model="gpt-4o", # Or gpt-4o-mini for speed/cost efficiency
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_input}
            ],
            temperature=0.7
        )
        ai_reply = response.choices[0].message.content
        await update.message.reply_text(ai_reply)

    except Exception as e:
        logging.error(f"Error: {e}")
        await update.message.reply_text("ENGINE ERROR. Rerouting...")

# --- EXECUTION ---
if __name__ == '__main__':
    application = ApplicationBuilder().token(TELEGRAM_TOKEN).build()
    
    # Handlers
    application.add_handler(CommandHandler('start', start))
    application.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), handle_message))
    
    print("ASMORATH is listening...")
    application.run_polling()
