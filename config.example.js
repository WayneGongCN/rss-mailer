module.exports = {
  feeds: [
    "http://rsshub.waynegong.cn/bjnews/news",                     // 新京报 - 时事
    "http://www.bbc.co.uk/zhongwen/simp/index.xml",               // BBC 主页
    "http://www.bbc.co.uk/zhongwen/simp/world/index.xml",         // BBC 国际
    "https://rsshub.app/wallstreetcn/news/global",                // 华尔街见闻
    "http://rsshub.waynegong.cn/bjnews/financial",                // 新京报 - 财经
    "https://sspai.com/feed",                                     // 少数派
    "https://36kr.com/feed",                                      // 36氪
    "http://www.ruanyifeng.com/blog/atom.xml",                    // 阮一峰的网络日志
    "http://feeds.feedburner.com/solidot",                        // 奇客Solidot
    "https://feeds.appinn.com/appinns/",                          // 小众软件
    "https://www.ifanr.com/feed",                                 // 爱范儿
    "https://wanqu.co/feed/",                                     // 湾区日报
    "http://rsshub.waynegong.cn/bilibili/user/video/598464467",   // bilibili - 苏星河牛通
    "http://rsshub.waynegong.cn/bilibili/user/video/163637592",   // bilibili - 老师好我叫何同学
    "http://rsshub.waynegong.cn/bilibili/user/video/258150656",   // bilibili - 回形针PaperClip
    "http://rsshub.waynegong.cn/bilibili/user/video/176037767",   // bilibili - 我是郭杰瑞
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

  readLater: {
    clientId: '5d27f006-5a2d-4a6f-b637-e39f0cf0e525'
  }
};
