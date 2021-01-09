(function () {
  const scopes = { scopes: ["Tasks.ReadWrite"] };
  const graphConfig = {
    graphGetTaskListEndpoint: `https://graph.microsoft.com/v1.0/me/todo/lists`,
    graphCreateTaskEndpoint: todoTaskListId => `https://graph.microsoft.com/v1.0/me/todo/lists/${todoTaskListId}/tasks`
  };
  const msalConfig = {
    auth: {
      clientId: '5d27f006-5a2d-4a6f-b637-e39f0cf0e525',
      authority: "https://login.microsoftonline.com/consumers",
      redirectUri: "https://rssmailer.waynegong.cn/"
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    }
  };
  const myMSALObj = new Msal.UserAgentApplication(msalConfig);


  // 检查登录状态
  if (!myMSALObj.getAccount()) {
    log('跳转登录 ...')
    return myMSALObj.loginRedirect(scopes)
  }


  // 解析参数
  const urlParams = new URLSearchParams(window.location.search);
  let stateParam = urlParams.get('state')

  // 主流程
  if (stateParam) {
    stateParam = JSON.parse(decodeURIComponent(atob(decodeURIComponent(stateParam))))
    let { title, url, feed } = stateParam
    title = `RSSMailer - ${title}`
    log(feed + ' - ' + title)

    log('查询 ReadLater List')
    getTaskList()
      .then(result => {
        const taskList = result.value
        const defaultTaskList = taskList.find(x => x.wellknownListName === 'defaultList' || x.displayName === "ReadLater")
        if (defaultTaskList) return defaultTaskList.id
        else throw new Error('not found defaultList')
      })
      .then(taskListId => {
        const task = { title, linkedResources: [{ webUrl: url, applicationName: feed, displayName: url }] }
        log('创建 ReadLater')
        return createTask(taskListId, task)
      })
      .then(() => {
        log('Done')
      })
      .catch(log)
  } else {
    log('参数错误')
  }

  function getTokenRedirect(request) {
    return myMSALObj.acquireTokenSilent(request)
      .catch(error => {
        return myMSALObj.acquireTokenPopup(request)
          .then(tokenResponse => {
            return tokenResponse;
          }).catch(error => {
            myMSALObj.loginRedirect(scopes)
          });
      });
  }

  function getTaskList() {
    return getTokenRedirect(scopes)
      .then(res => fetch(graphConfig.graphGetTaskListEndpoint, { method: 'GET', headers: { Authorization: `Bearer ${res.accessToken}` } }))
      .then(res => res.json())
  }

  function createTask(taskListId, data) {
    return getTokenRedirect(scopes)
      .then(res => fetch(graphConfig.graphCreateTaskEndpoint(taskListId), { method: 'POST', headers: { Authorization: `Bearer ${res.accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify(data) }))
      .then(res => res.json())
  }

  function log(str) {
    if (typeof str === 'object') str = JSON.stringify(str)
    document.body.innerHTML += str + '</br>'
  }
})()