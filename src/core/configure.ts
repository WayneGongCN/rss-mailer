import { resolve } from "path";
import { Options } from "../rssmailer";
import logger from "./logger";

export interface EmailSenderConf {
  type: "email";
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  subject: string;
  from: string;
  to: string;
}

export interface FileSenderConf {
  type: "file";
  path: string;
}

export interface FreshFilterRule {
  type: "fresh";
  fresh: number;
}

export interface CountFilterRule {
  type: "count";
  max: number;
}

export interface Conf {
  template: string;
  feeds: Feed[];
  sender: (EmailSenderConf | FileSenderConf)[];
  filter: (FreshFilterRule | CountFilterRule)[];
}

export interface Feed {
  url: string;
  charset: "utf8" | "gbk";
  timeout: number;
}

const DEFAULT_CONF = {
  template:
    "rss-mailer/template/default.ejs",
};

const FEED_DEFAULT_CONF: Partial<Feed> = {
  timeout: 30 * 1000,
  charset: "utf8",
};

export default (confPath: string, options: Options): Conf => {
  const resolveConfPath = resolve(confPath);
  logger.debug({ resolvePath: resolveConfPath });

  const conf = require(resolveConfPath) as Conf;
  logger.debug({ conf });

  const feeds = conf.feeds.map((x: string | Feed) => {
    if (typeof x === "string") x = { ...FEED_DEFAULT_CONF, url: x } as Feed;
    return { ...FEED_DEFAULT_CONF, ...x };
  });
  return {
    ...DEFAULT_CONF,
    ...conf,
    feeds,
  };
};
