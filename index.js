const path = require("path");
const artTemplate = require("art-template");
const nodemailer = require("nodemailer");
const Rssparser = require("rss-parser");
const rssparser = new Rssparser();
const axios = require("axios");
const iconv = require("iconv-lite");

const DEFAULT_FEED_CONF = {
  charset: "utf8",
};

// init config
const config = require("./config");
const { feeds, mailer, filter, logPath } = config;

// init logger
const { getLogger, configure } = require("log4js");
const logger = getLogger();
const categories = {
  default: { appenders: ["file", "stdout"], level: "info" },
};
const appenders = { stdout: { type: "stdout" } };
if (logPath)
  appenders.file = { type: "file", filename: path.join(__dirname, logPath) };

configure({ categories, appenders });
logger.info(`Start at \t ${new Date().toLocaleString()}`);

// main
fetchFeed(feeds)
  .then((feedsRes) => parseFeedResult(feedsRes, filter))
  .then((renderData) =>
    sendEmail(mailer.smtpConf, mailer.emailConf, renderData)
  );

/**
 * Fetch feed content
 * @param {Array<string>} feeds feed url
 */
function fetchFeed(feeds) {
  const promises = feeds
    .map((x) => {
      let feedConf = { ...DEFAULT_FEED_CONF };
      if (typeof x === "string") {
        feedConf.feed = x;
      } else {
        feedConf = Object.assign(feedConf, x);
      }
      if (!feedConf) return;

      const {feed, charset} = feedConf
      logger.info(`Fetching \t ${feed} ...`);
      return axios
        .get(feed, { responseType: "arraybuffer" })
        .then(res => {
          const decodeHandle = {
            'utf8': (buffer) => buffer.toString('utf8'),
            'gbk': buffer => iconv.decode(buffer, 'gbk')
          }
          return decodeHandle[charset](res.data)
        })
        .then(res => rssparser.parseString(res))
        .then(result => {
          logger.info(`Success \t ${feed}`)
          return  { feed, result, error: null }
        })
        .catch(error => {
          logger.error("Fetch error: \t ", feed, error);
          return { feed, error, result: null };
        })
    })
    .filter(Boolean);

  return Promise.all(promises);
}

/**
 * filter and render
 * @param {*} feedsRes
 * @param {*} filter
 */
async function parseFeedResult(feedsRes, filter) {
  const now = Date.now();
  const renderData = feedsRes.map((feedRes) => {
    const { feed, result, error } = feedRes;
    logger.info("Parse\t", feed);
    if (error || !result) return feedRes;

    // result: items, feedUrl, title, description, link, language, copyright, lastBuildDate, ttl
    // items: creator, author, title, link, pubDate, content, contentSnippet, guid, isoDate
    let items = result.items;

    // filter by fresh
    if (filter.fresh) {
      items = items.filter((x) => {
        let date = x.pubDate || x.isoDate;
        if (!date) return false;
        return now - new Date(date).getTime() <= filter.fresh * 60 * 60 * 1000;
      });
    }

    if (filter.max > 0) {
      items = items.slice(0, filter.max);
    }

    result.items = items;
    return feedRes;
  });

  logger.info("Render");
  artTemplate.defaults.minimize = true;
  return artTemplate(path.join(__dirname, "template.art"), { renderData });
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
        logger.error("Error on send email", e);
        return reject(e);
      }
      logger.info("Send email success");


      logger.info("Done");
      resolve(res);
    });
  });
}
