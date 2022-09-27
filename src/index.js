const Koa = require('koa')
const Static = require('koa-static')
const { getIp, getPort, getOption, openBrowser } = require('./utils')
const chalk = require('./utils/chalk')
const { update } = require('./data/setting')
const path = require('path')
const catalog = require('./model/catalog')

const checkDataCatalog = (database, static) => {
  const fs = require('fs')
  const path = require('path')
  try {
    fs.readdirSync(database, 'utf-8')
  } catch {
    console.log(chalk.blue('\n  mkdir database catalog...'))
    fs.mkdirSync(database)
  }
  fs.mkdirSync(path.resolve(database, 'base'), { recursive: true })
  fs.mkdirSync(static, { recursive: true })
}

getPort().then(port => {
  const app = new Koa()
  const { database, static, prefix } = getOption()
  update({ database, static, prefix })
  checkDataCatalog(database, static)

  catalog.get().then((data) => {
    if (data.database !== database) {
      throw false
    }
  }).catch(() => {
    catalog.getNew().then(data => {
      catalog.update({
        data,
        database
      })
    })
  })
  
  // 更新setting之后注册
  const router = require('./router')

  app
    .use(async (ctx, next) => {
      ctx.set({
        'Access-Control-Allow-Origin': ctx.request.header.origin || '*',
        'Access-Control-Request-Method': 'POST, OPTIONS, GET',
        'Access-Control-Allow-Headers': 'x-requested-with,Content-Type,Accept,authorization',
        'Access-Control-Allow-Credentials': 'true'
      })
      if (ctx.method.toLocaleUpperCase() === 'OPTIONS') {
        ctx.response.status = 200
      } else {
        if (ctx.URL.pathname === '/prefix') {
          ctx.response.body = prefix
        }
        await next()
      }
    })
    .use(Static(path.resolve(__dirname, '../swagger'), { defer: true }))
    .use(Static(static, { defer: true }))
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(port, () => {
      const ipObj = getIp()
      let msg = '\n  Server running at:'
      let url = ''
      Object.keys(ipObj).forEach(k => {
        ipObj[k].forEach((ip, i) => {
          const link = `http://${ip}:${port}/swagger.html`
          if (k === 'Local' && i === 0) {
            url = link
          }
          msg += `\n    - ${k}: ${chalk.underline.green(link)}`
        })
      })
      openBrowser(url)
      try {
        process.send({ 'name': 'backend', port })
      } catch {
        // 不是通过主进程启动的
      }
      console.log(msg)
    })
})