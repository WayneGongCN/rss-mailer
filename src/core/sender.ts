import { Conf, EmailSenderConf, FileSenderConf } from "./configure";
import logger from "./logger";
import { createTransport } from "nodemailer";
import { writeFile } from "fs";
import path from "path";

/**
 *
 * @param conf
 * @param emailConf
 * @param content
 * @returns
 */
function sendEmail(conf: Conf, emailConf: EmailSenderConf, content: string) {
  logger.info(`Send email ${emailConf.host} ...`);

  const { type, subject, from, to, ...smtpConf } = emailConf;
  const transporter = createTransport(smtpConf);
  const message = {
    ...emailConf,
    html: content,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (error, res) => {
      if (error) {
        logger.error(`send email error ${error?.message || error}`);
        return reject(error);
      }
      logger.info(`send email success`);
      resolve(res);
    });
  });
}

/**
 *
 * @param conf
 * @param writeFileConf
 * @param content
 * @returns
 */
function sendFile(
  conf: Conf,
  writeFileConf: FileSenderConf,
  content: string
): Promise<void> {

  return new Promise((resolve, reject) => {
    const resolvePath = path.resolve(writeFileConf.path)
    logger.info(`write file ${resolvePath} ...`);
    writeFile(resolvePath, content, (error) => {
      if (error) {
        logger.error(`write file error ${error?.message || error}`);
        return reject(error);
      }
      logger.info(`write file success`);
      resolve();
    });
  });
}

/**
 *
 */
const handlerMap = {
  email: sendEmail,
  file: sendFile,
};

/**
 *
 */
export default (conf: Conf) => (content: string) => {
  const { sender: senderList } = conf;
  const promises = senderList.map((sender) => {
    const handler = handlerMap[sender.type];
    return (
      // @ts-ignore
      handler?.(conf, sender, content) ?? Promise.reject(`${sender.type} error`)
    );
  });

  return Promise.allSettled(promises);
};
