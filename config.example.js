/* ============================================================
 * NovaTools — نموذج الإعدادات
 * انسخ الملف ده → config.js → حط القيم بتاعتك
 * ملف config.js مش بيترفع على GitHub (في .gitignore)
 * ============================================================ */

const CONFIG = {
  // ===== تليجرام =====
  TG_BOT_TOKEN: "ضع_التوكن_هنا",
  TG_CHAT_ID:   "ضع_chat_id_هنا",

  // ===== روابط =====
  PAYLOAD_URL: "https://github.com/USERNAME/REPO/releases/latest/download/NovaTools.exe",

  // ===== إعدادات الموقع =====
  SITE_NAME: "NovaTools",
  VERSION:   "4.2.1"
};

// تصدير (لا تعدل)
if (typeof module !== "undefined") module.exports = CONFIG;