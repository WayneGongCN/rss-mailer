require("dotenv").config();
const fs = require("fs");
const path = require("path");
const artTemplate = require("art-template");
const nodemailer = require("nodemailer");
const Rssparser = require("rss-parser");
const rssparser = new Rssparser();


// init logger
const { getLogger, configure } = require("log4js");
const logger = getLogger();
configure({
  appenders: {
    file: { type: "file", filename: path.join(__dirname, 'log', process.env.logPath) },
    stdout: { type: 'stdout' }
  },
  categories: { default: { appenders: ["file", "stdout"], level: process.env.logLevel } },
});


// init ignore map
let ignore = {};
try {
  ignore = require(__dirname, 'log', "ignore.json");
} catch (e) { }



logger.info("Run task ----------");
const rssConf = require("./rssConf");
const smtpConf = {
  port: process.env.port,
  host: process.env.host,
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
};
const emailConf = {
  from: process.env.from,
  to: process.env.to,
  subject: process.env.subject,
};

fetchFeed(rssConf)
  .then((feedsRes) => parseFeedData(feedsRes, rssConf))
  .then((renderData) => sendEmail(smtpConf, emailConf, renderData));


function fetchFeed(rssConf) {
  const promises = rssConf.feeds.map(feed => {
    logger.info(`Fetching ${feed} ...`);
    return rssparser
      .parseURL(feed)
      .then(result => {
        logger.info(`Fetch ${feed} success`);
        logger.debug('result: ', { ...result, items: result.items.length })
        return { feed, result };
      })
      .catch(e => {
        logger.error("Error in fetch: ", feed, e);
        return { feed, result: null };
      });
  });
  return Promise.all(promises);
}


async function parseFeedData(feedsRes, rssConf) {
  const promises = feedsRes.map((feedRes, idx) => {
    let data = null;
    try {
      logger.debug(`parse feed: `, feedRes.feed)
      data = rssConf.parser(feedRes, ignore);
    } catch (e) {
      logger.error("Error in parse: ", feedRes, e);
    }
    return data;
  });
  const renderData = await Promise.all(promises);

  artTemplate.defaults.minimize = true;
  return artTemplate(path.join(__dirname, process.env.template), { renderData });
}


function sendEmail(smtpConf, emailConf, content) {
  logger.debug('sendEmail: ', smtpConf, emailConf, content.length)
  const transporter = nodemailer.createTransport(smtpConf);
  const message = {
    ...emailConf,
    html: content,
  };

  logger.info("Send email ...");
  transporter.sendMail(message, (e, res) => {
    logger.debug('sendEmail callback: ', e, res)
    if (e) {
      logger.error("Error in send email", e);
    } else {
      fs.writeFileSync(
        path.join(__dirname, 'log', `${new Date().toISOString().slice(0, 10)}.html`),
        content
      );
      fs.writeFileSync(
        path.join(__dirname, 'log', "ignore.json"),
        JSON.stringify(ignore)
      );
      logger.info("Done");
    }
  });
}
