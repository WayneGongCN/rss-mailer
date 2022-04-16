# RSSMailer

获取 RSS 资讯并通过 Email 发送。

## 使用

- `mv config.js.example config.js` 重命名 example 配置并进行对应修改；
- `npm install` Or `yarn` 安装依赖
- `node index.js` 执行脚本

![run](./docs/images/run.gif)


### Filter

编辑 `config.js` 的 `filter` 配置fresh（内容时效）、max（单个 feed 源最大数量）。


### crontab

crontab 定时每天早上 8 点定时发送邮件。

- `crontab -e`
- `0 8 * * * cd /path/to/RSSMailer && node index.js`
