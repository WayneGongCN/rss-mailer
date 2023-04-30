
const conf = {
  feeds: [
    "https://rsshub.app/infzm/2",                     // 南方周末-新闻
    "https://rsshub.app/wallstreetcn/global",         // 华尔街见闻 - 资讯
    "https://rsshub.app/jiemian",                     // 快报_界面新闻
    "https://rsshub.app/bjnews/realtime",             // 新京报
    "https://rsshub.app/zaozao/article/quality",      // 前端早早聊
    "https://rsshub.app/docschina/jsweekly",          // 印记中文周刊
    "http://feeds.feedburner.com/ruanyifeng",         // 阮一峰的网络日志
  ],

  sender: [
    {
      type: "email",  // Send to email

      // SMTP configure
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
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


console.log('RSSMailer conf: ', JSON.stringify(conf))

module.exports = conf;
