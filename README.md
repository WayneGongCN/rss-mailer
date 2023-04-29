# rss-mailer

![npm](https://img.shields.io/npm/v/rss-mailer)

The Easy Way to Send RSS Feeds to Email

Avoid information explosion and AI Recommendation Algorithms

Improve the efficiency of information acquisition

## Usage

```shell
# install
$ npm install -g rss-mailer

# run
$ rssmailer -c path/to/config
```

## Configure File

The configure file supports `.json` and `.js` formats.

Example: 
```js
module.exports = {
  // RSS url list
  feeds: [
    // Easy to use via url
    "https://waynegong.cn/atom.xml",
    
    // Full usage configuration
    {
      url: "https://www.ruanyifeng.com/blog/atom.xml",  // Url is required
      charset: "utf8",  // Support 'utf8' 'gbk', default 'utf8'
      timeout: 30000, // Timeout for requesting RSS feeds, default 30000 ms
    },
  ],

  sender: [
    
    {
      type: "email",  // Send to email
      
      // SMTP configure
      host: "mail.waynegong.cn",
      port: 465,
      secure: true,
      auth: {
        user: "rssmailer@waynegong.cn",
        pass: "******",
      },
      
      // Email configure
      subject: "RSSMailer Daily",
      from: "RSSMailer <RSSMailer@waynegong.cn>",
      to: "me@waynegong.cn",
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
```
