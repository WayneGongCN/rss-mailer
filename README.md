# RSSMailer

获取 RSS 资讯并通过 Email 发送。


## Use
- 配置 `config.js`
- 运行 `node index.js`


## crontab

通过定时 crontab 每天早上 8 点定时发送邮件。

- `crontab -e`
- `0 8 * * * cd /path/to/RSSMailer && node index.js`

### nvm

如果使用 nvm 则新建 `run.sh` 脚本，使用 `0 8 * * * cd /path/to/RSSMailer && ./run.sh`。
```
#!/bin/sh

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

node index.js
```