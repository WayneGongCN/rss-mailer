#!/home/ubuntu/.nvm/versions/node/v14.15.1/bin/node

const fs = require("fs");
const path = require("path");
const artTemplate = require("art-template");
const nodemailer = require("nodemailer");
const Rssparser = require("rss-parser");
const rssparser = new Rssparser();

// init config
const config = require("./config");
const { feeds, mailer, filter, readLater, htmlDir, logPath } = config;

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
  .then((feedsRes) => parseFeedResult(feedsRes, filter, readLater))
  .then((renderData) =>
    sendEmail(mailer.smtpConf, mailer.emailConf, renderData)
  );

/**
 * Fetch feed content
 * @param {Array<string>} feeds feed url
 */
function fetchFeed(feeds) {
  const promises = feeds.map((feed) => {
    logger.info(`Fetching \t ${feed} ...`);
    return rssparser
      .parseURL(feed)
      .then((result) => {
        logger.info(`Success \t ${feed}`);
        return { feed, result, error: null };
      })
      .catch((error) => {
        logger.error("Fetch error: \t ", feed, error);
        return { feed, error, result: null };
      });
  });

  return Promise.all(promises);
}

/**
 * filter and render
 * @param {*} feedsRes
 * @param {*} filter
 * @param {*} readLater
 */
async function parseFeedResult(feedsRes, filter, readLater) {
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

    items = items.map((x) => {
      x.pubDate = new Date(x.pubDate).toLocaleString();
      if (readLater && readLater.clientId) {
        let state = {
          clientId: readLater.clientId,
          title: x.title,
          url: x.link,
          feed: result.title,
        };
        state = JSON.stringify(state);
        state = encodeURIComponent(state);
        state = encodeURIComponent(Buffer.from(state).toString("base64"));

        x.readLaterUrl = `https://rssmailer.waynegong.cn/readlater.html?state=${state}`;
      }
      return x;
    });

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

      if (htmlDir) {
        const htmlFilePath = path.join(
          __dirname,
          `${new Date().toISOString().slice(0, 10)}.html`
        );
        logger.info(`Write html to: ${htmlFilePath}`);
        fs.writeFileSync(htmlFilePath, content);
      }

      logger.info("Done");
      resolve(res);
    });
  });
}
