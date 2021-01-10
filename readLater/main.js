/**
 * 创建 Task 流程：
 * login -------------------------> parseState ------------------------> getTaskList ----------------> createTask --------> done
 *        (handleRedirectPromise)               ({ title、url、feed })                  (taskListId)                        (closePage)
 */


const DEFAULT_MSAL_CONF = {
  auth: {
    clientId: '5d27f006-5a2d-4a6f-b637-e39f0cf0e525',
    authority: "https://login.microsoftonline.com/consumers",
    redirectUri: "https://rssmailer.waynegong.cn/",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
}


class ReadLater {
  constructor() { }


  /**
   * MS 登录
   */
  login(msalConf) {
    this._scopes = { scopes: ["User.Read", "Tasks.ReadWrite"] }
    this._msalInstance = new msal.PublicClientApplication(msalConf)

    return new Promise((resolve, reject) => {
      this._msalInstance.handleRedirectPromise()
        .then(res => {
          logger.log('login handleRedirectPromise', res)
          if (res) {
            this._scopes.account = res.account
            resolve(res)
          }
          reject(res)
        })
        .catch(reject)

      // login allways
      this._msalInstance.loginRedirect(this._scopes).catch(e => {
        logger.warn(e)
      })
    })
  }


  /**
   * 创建 Task
   * @param {Objsec} task 
   */
  async create(task) {
    const taskList = await this._getMSTaskList()
    const readLaterTaskList = taskList.find(x => x.displayName === "ReadLater")
    const defaultTaskList = taskList.find(x => x.wellknownListName === 'defaultList')

    // 在指定 TaskList 中创建 Task
    // ReadLater > defaultList
    if (!readLaterTaskList && !defaultTaskList) return Promise.reject('Not found task list.')
    const targetTaskList = readLaterTaskList || defaultTaskList
    logger.log(`_createMSTask targetTaskList: ${targetTaskList.displayName}`)

    return this._createMSTask(task, targetTaskList.id)
  }


  /**
   * 创建 Task 请求
   * @param {Object} task 
   * @param {String} taskListId 
   */
  _createMSTask(task, taskListId) {
    logger.log(`_createMSTask request:`)
    const reqeustUrl = taskListId => `https://graph.microsoft.com/v1.0/me/todo/lists/${taskListId}/tasks`
    const requestOptions = (token, task) => ({ method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(task) })

    return this._getToken()
      .then(res => fetch(logPip(reqeustUrl(taskListId)), logPip(requestOptions(res.accessToken, task))))
      .then(res => res.ok ? res : Promise.reject(res))
      .then(res => res.json())
      .then(res => {
        logger.log(`_createMSTask success`, res)
        return res.value
      })
  }


  /**
   * 获取 TaskList 请求
   */
  _getMSTaskList() {
    logger.log(`_getMSTaskList request:`)
    const requestUrl = `https://graph.microsoft.com/v1.0/me/todo/lists`
    const requestOptions = token => ({ method: 'GET', headers: { Authorization: `Bearer ${token}` } })

    return this._getToken()
      .then(res => fetch(logPip(requestUrl), logPip(requestOptions(res.accessToken))))
      .then(res => res.ok ? res : Promise.reject(res))
      .then(res => res.json())
      .then(res => {
        logger.log(`_getMSTaskList success`, res)
        return res.value
      })
  }

  /**
   * 获取 OAuth Token
   */
  _getToken() {
    logger.log(`_getToken`)
    return this._msalInstance.acquireTokenSilent(this._scopes)
      .then(res => {
        logger.log('_getToken acquireTokenSilent success', res)
        return res
      })
      .catch(e => {
        logger.warn(`_getToken acquireTokenSilent error`, e)
        if (e instanceof msal.InteractionRequiredAuthError) {
          logger.warn(`try acquireTokenRedirect ...`)
          return this._msalInstance.acquireTokenRedirect(this._scopes)
        } else {
          return Promise.reject(e)
        }
      })
  }
}


/**
 * inital logger
 */
let logHistory = localStorage.getItem('logger') || ''
const logger = ['log', 'warn', 'error'].reduce((o, type) => {
  o[type] = function (...args) {
    const logContent = `[${new Date().toLocaleString()}] [${type.toUpperCase()}] \t` + args.map(x => typeof x === 'object' ? JSON.stringify(x) : x).join('\t') + `\n`
    logHistory += logContent
    localStorage.setItem('logger', logHistory)
    return console[type](...args)
  }
  return o
}, {})


function logPip(val) {
  logger.log(val)
  return val
}
function closePage() {
  window.pener = null;
  window.open("about:blank", "_self");
  window.close();
}
function parseState(state) {
  state = decodeURIComponent(state)
  state = atob(state)
  state = decodeURIComponent(state)
  state = JSON.parse(state)
  return state
}
function updateView(str) {
  document.body.innerHTML += `<h1>${str}</h1></br>`
}


/**
 * main
 */
(async function () {
  logger.log(`---------- ${new Date().toLocaleString()} ----------`)
  const readLater = new ReadLater()

  updateView('正在获取 Microsoft 登录信息 ...')
  readLater.login(DEFAULT_MSAL_CONF)
    .then(res => {
      updateView('正在解析参数 ...')
      const urlParams = new URLSearchParams(window.location.search);
      let stateParam = urlParams.get('state')

      if (!stateParam) return updateView(`参数错误 state: ${stateParam}`)
      stateParam = parseState(stateParam)

      const { title, url, feed } = stateParam
      updateView(`解析参数成功: ${feed} - ${title}`)

      updateView(`正在创建 To do task...`)
      return readLater.create({
        title,
        linkedResources: [{ webUrl: url, applicationName: feed, displayName: url }]
      })
    })
    .then(() => {
      updateView(`创建成功！`)
      updateView(`<a href="javascript:closePage()" >关闭页面</a>`)
    })
    .catch(e => {
      updateView(`创建失败！${e.toString()}`)
    })
})()