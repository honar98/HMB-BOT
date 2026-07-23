require("dotenv").config();

const express = require("express");
const { verifyKeyMiddleware } = require("discord-interactions");

const app = express();
const PORT = process.env.PORT || 3000;

// پشکنینی سەرەتایی بۆ دڵنیابوون لە کارکردنی وێب سەروەرەکە
app.get("/", (req, res) => {
  res.send("HMB-BOT is active 24/7 via Webhook!");
});

// ڕێڕەوی سەرەکی بۆ وەگرتنی فەرمانەکان لە دیسکۆردەوە
app.post("/api/interactions", verifyKeyMiddleware(process.env.PUBLIC_KEY), async (req, res) => {
  const { type, data } = req.body;

  // ١. وەڵامدانەوەی پشکنینی دیسکۆرد (PING)
  if (type === 1) {
    return res.send({ type: 1 });
  }

  // ٢. جێبەجێکردنی فەرمانەکانی سلاش (Slash Commands)
  if (type === 2) {
    // بۆ نموونە فەرمانی /ping
    if (data.name === 'ping') {
      return res.send({
        type: 4, // ناردنی پەیام بۆ چات
        data: {
          content: 'پۆنگ! 🏓 بۆتەکە بە سەرکەوتوویی لە ڕێگەی Webhook وەڵام دەداتەوە.',
        },
      });
    }

    // دەتوانیت لێرە فەرمانەکانی تریش زیاد بکەیت
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Webhook server is listening on port ${PORT}`);
});
