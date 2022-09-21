const Koa = require('koa')
const Router = require('@koa/router')
const { getIp, getPort, getOption } = require('./utils')
const chalk = require('./utils/chalk')
const { update } = require('./model/setting')

const checkDataCatalog = (database) => {
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
}

getPort().then(port => {
  const app = new Koa()
  const router = new Router()
  const { database, static } = getOption()
  update({ database, static })
  checkDataCatalog(database)

  app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(port, () => {
      let msg = '\n  Server running at:'
      msg += `\n    - Local:   ${chalk.underline.green(`http://localhost:${port}/`)}`
      getIp().forEach(ip => {
        msg += `\n    - Network: ${chalk.underline.green(`http://${ip}:${port}/`)}`
      })
      try {
        process.send({ 'name': 'backend', port })
      } catch {
        // 不是通过主进程启动的
      }
      console.log(msg)
    })
})