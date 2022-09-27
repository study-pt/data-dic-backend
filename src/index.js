const Koa = require('koa')
const Static = require('koa-static')
const { getIp, getPort, getOption, openBrowser } = require('./utils')
const chalk = require('./utils/chalk')
const { update } = require('./data/setting')
const common = require('./model/common')

const checkDataCatalog = (database, static) => {
  const fs = require('fs')
  const path = require('path')
  try {
    fs.readdirSync(database, 'utf-8')
  } catch {
    console.log(chalk.blue('\n  mkdir database catalog...'))
    fs.mkdirSync(database)
  }
  fs.mkdir(path.resolve(database, 'base'), { recursive: true }, err => {
    if (err) {
      throw err
    }
  })
  fs.mkdir(static, { recursive: true }, (err) => {
    if (err) {
      throw err
    }
  })
}

getPort().then(port => {
  const app = new Koa()
  const { database, static, prefix } = getOption()
  update({ database, static, prefix })
  checkDataCatalog(database, static)
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
        } else if (ctx.URL.pathname === '/swagger.html') {
          ctx.response.body = await common.getSwagger()
        }
        await next()
      }
    })
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