const Koa = require('koa')
const Router = require('@koa/router')
const { getIp, getPort } = require('./utils')
const chalk = require('./utils/chalk')

getPort().then(port => {
  const app = new Koa()
  const router = new Router()

  app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(port, () => {
      let msg = '  App running at:'
      msg += `\n    - Local:   ${chalk.underline.green(`http://localhost:${port}/`)}`
      getIp().forEach(ip => {
        msg += `\n    - Network: ${chalk.underline.green(`http://${ip}:${port}/`)}`
      })
      console.log(msg)
    })
})