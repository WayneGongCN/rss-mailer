const fs = require("fs");
const path = require("path");
const artTemplate = require("art-template");
const nodemailer = require("nodemailer");
const Rssparser = require("rss-parser");
const rssparser = new Rssparser();


// init logger
const { getLogger, configure } = require("log4js");
const logger = getLogger();
const categories = { default: { appenders: ["file", "stdout"], level: 'info' } }
const appenders = {
  file: { type: "file", filename: path.join(__dirname, 'rssmailer.log') },
  stdout: { type: 'stdout' }
}
configure({ categories, appenders });


logger.info(`Start at \t ${new Date().toLocaleString()}`);
const config = require("./config");
const { feeds, mailer, filter } = config


fetchFeed(feeds)
  .then(feedsRes => parseFeedResult(feedsRes, filter))
  .then(renderData => sendEmail(mailer.smtpConf, mailer.emailConf, renderData));


/**
 * Fetch feed content
 * @param {Array<string>} feeds feed url  
 */
function fetchFeed(feeds) {
  const promises = feeds.map(feed => {
    logger.info(`Fetching \t ${feed} ...`);
    return rssparser
      .parseURL(feed)
      .then(result => {
        logger.info(`Success \t ${feed}`);
        return { feed, result, error: null };
      })
      .catch(error => {
        logger.error("Fetch error: \t ", feed, error);
        return { feed, error, result: null };
      });
  });

  return Promise.all(promises);
}


async function parseFeedResult(feedsRes, filter) {
  const now = Date.now()
  const renderData = feedsRes.map(feedRes => {
    const { feed, result, error } = feedRes
    logger.info('Parse\t', feed)
    if (error || !result) return feedRes

    // result: items, feedUrl, title, description, link, language, copyright, lastBuildDate, ttl
    // items: creator, author, title, link, pubDate, content, contentSnippet, guid, isoDate
    let items = result.items

    // filter by fresh
    if (filter.fresh) {
      items = items.filter(x => {
        let date = (x.pubDate || x.isoDate)
        if (!date) return false
        return now - new Date(date).getTime() <= filter.fresh * 60 * 60 * 1000
      })
    }

    if (filter.max > 0) {
      items = items.slice(0, filter.max)
    }

    items = items.map(x => {
      x.pubDate = new Date(x.pubDate).toLocaleString();
      return x;
    })

    result.items = items
    return feedRes;
  });

  logger.info('Render')
  artTemplate.defaults.minimize = true;
  return artTemplate(path.join(__dirname, 'template.art'), { renderData });
}


/**
 * Send email
 * @param {*} smtpConf    https://nodemailer.com/smtp/
 * @param {*} emailConf   https://nodemailer.com/message/
 * @param {*} content     email content
 */
function sendEmail(smtpConf, emailConf, content) {
  logger.info("Send email ...");
  const transporter = nodemailer.createTransport(smtpConf);
  const message = {
    ...emailConf,
    html: content,
  };


  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (e, res) => {
      if (e) {
        logger.error("Error on send email", e)
        return reject(e)
      }
      logger.info("Send email success")

      const htmlPath = path.join(__dirname, 'log', `${new Date().toISOString().slice(0, 10)}.html`)
      fs.writeFileSync(htmlPath, content);

      logger.info("Done");
      resolve(res)
    });
  })
}
