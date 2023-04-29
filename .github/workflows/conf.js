
module.exports = {
  feeds: [
    "http://rsshub.waynegong.cn/bjnews/news",                     // 新京报 - 时事
    "http://rsshub.waynegong.cn/bjnews/financial",                // 新京报 - 财经
    "http://www.ruanyifeng.com/blog/atom.xml",                    // 阮一峰的网络日志
  ],

  sender: [
    {
      type: "email",  // Send to email

      // SMTP configure
      host: process.env.MAIL_HOST,
      port: process.env.PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },

      // Email configure
      subject: process.env.MAIL_SUBJECT,
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
    },

    {
      type: "file", // Write to file
      path: "output.html",  // File path is required
    },
  ],

  filter: [
    {
      type: "fresh",  // Filter based on freshness policy
      fresh: 86400000, // Within the last 24 hours (24 * 60 * 60 * 1000)ms
    }
  ],
};