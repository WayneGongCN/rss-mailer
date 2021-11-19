module.exports = {
  feeds: [
    {
      feed: "http://bbs.pinggu.org/forum.php?mod=rss&fid=286&auth=0",
      charset: 'gbk'
    },
    "http://feeds.feedburner.com/solidot",
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

  // 过滤参数
  filter: {
    // 按咨询新鲜度过滤
    fresh: 24,
    // 按 RSS 源咨询数量过滤
    max: 10
  },

  logPath: './rssmailer.log'
};
