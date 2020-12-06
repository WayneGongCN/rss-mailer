require("dotenv").config();
const fs = require("fs");
const path = require("path");
const artTemplate = require("art-template");
const nodemailer = require("nodemailer");
const Rssparser = require("rss-parser");
const rssparser = new Rssparser();
const { getLogger, configure } = require("log4js");


let ignore = {};
try {
  ignore = require("./log/ignore.json");
} catch (e) {}

const logger = getLogger();
configure({
  appenders: { default: { type: "file", filename: path.join(__dirname, process.env.logPath) }},
  categories: { default: { appenders: ["default"], level: process.env.logLevel } },
});


logger.info("Run task ...");
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
  const promises = rssConf.feeds.map((feed) => {
    logger.debug(`Fetching ${feed} ...`);
    return rssparser
      .parseURL(feed)
      .then((result) => {
        logger.debug(`Fetch ${feed} success`);
        return { feed, result };
      })
      .catch((e) => {
        logger.error("Error in fetch: ", feed);
        return { feed, result: null };
      });
  });
  return Promise.all(promises);
}


async function parseFeedData(feedsRes, rssConf) {
  const promises = feedsRes.map((feedRes) => {
    let data = null;
    try {
      data = rssConf.parser(feedRes, ignore);
    } catch (e) {
      logger.error("Error in parse: ", feedRes);
    }
    return data;
  });
  const renderData = await Promise.all(promises);

  artTemplate.defaults.minimize = true;
  return artTemplate(path.join(__dirname, process.env.template), { renderData });
}


function sendEmail(smtpConf, emailConf, content) {
  const transporter = nodemailer.createTransport(smtpConf);
  const message = {
    ...emailConf,
    html: content,
  };

  logger.debug("Send email ...");
  transporter.sendMail(message, (e, res) => {
    fs.writeFileSync(
      path.join(__dirname, `log/${new Date().toISOString().slice(0, 10)}.html`),
      content
    );
    if (e) {
      logger.error("Error in send email", e);
    } else {
      fs.writeFileSync(
        path.join(__dirname, "log/ignore.json"),
        JSON.stringify(ignore)
      );
      logger.info("Done");
    }
  });
}
