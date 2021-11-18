module.exports = {
  feeds: [
    "http://www.bbc.co.uk/zhongwen/simp/index.xml",               // BBC 主页
    "http://www.bbc.co.uk/zhongwen/simp/world/index.xml",         // BBC 国际
    "https://sspai.com/feed",                                     // 少数派
    "https://36kr.com/feed",                                      // 36氪
    "http://feeds.feedburner.com/solidot",                        // 奇客Solidot
    "https://www.ifanr.com/feed",                                 // 爱范儿
    "https://wanqu.co/feed/",                                     // 湾区日报
  ],

  mailer: {
    smtpConf: {
      host: 'smtp.office365.com',
      port: '587',
      auth: {
        user: 'xxx@hotmail.com',
        pass: 'xxx',
      }
    },
    emailConf: {
      subject: 'RSSMailer 每日推送',
      from: 'RSSMailer <xxx@hotmail.com>',
      to: 'xxx@hotmail.com',
    }
  },

  filter: {
    fresh: 24,  // 24 hours
    max: 10      // item feed max records
  },

  logPath: './rssmailer.log'
};
