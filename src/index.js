const Koa = require('koa')
const Router = require('@koa/router')
const { getIp, getPort } = require('./utils')
const chalk = require('./utils/chalk')

getPort().then(port => {
  const app = new Koa()
  const router = new Router()
  // 会通过cli传入
  const database = process.argv.slice(2)[0]
  console.log('database', database)

  app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(port, () => {
      let msg = '\n  App running at:'
      msg += `\n    - Local:   ${chalk.underline.green(`http://localhost:${port}/`)}`
      getIp().forEach(ip => {
        msg += `\n    - Network: ${chalk.underline.green(`http://${ip}:${port}/`)}`
      })
      console.log(msg)
    })
})