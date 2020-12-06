module.exports = {
  feeds: [
    "https://sspai.com/feed",
    "https://36kr.com/feed",
    "http://www.ruanyifeng.com/blog/atom.xml",
    "https://feeds.appinn.com/appinns/",
    "https://zhihu.com/rss",
    "http://feeds.feedburner.com/solidot",
    "https://www.ifanr.com/feed",
    "https://wanqu.co/feed/",
  ],
  parser: async ({ feed, result }, sentMap) => {
    if (!result) return { feed, result: null };
    // result: items, feedUrl, title, description, link, language, copyright, lastBuildDate, ttl
    // items: creator, author, title, link, pubDate, content, contentSnippet, guid, isoDate
    return {
      feed,
      result: {
        ...result,
        items: result.items
          .filter((item) => {
            const sent = item.link in sentMap;
            if (!sent) sentMap[item.link] = new Date().toLocaleString();
            return !sent;
          })
          .slice(0, 10)
          .map((x) => {
            x.pubDate = new Date(x.pubDate).toLocaleString();
            return x;
          }),
      },
    };
  },
};
