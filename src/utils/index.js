/**
 * 获取network ip
 * @return {Array<{Local:string[],Network:string[]}>} ip list
 */
exports.getIp = () => {
  const ipObj = {
    Local: ['localhost'],
    Network: []
  }
  const interfaces = require('os').networkInterfaces()
  for (const k in interfaces) {
    interfaces[k].forEach(instance => {
      if (instance.family === 'IPv4') {
        if (instance.internal) {
          ipObj.Local.push(instance.address)
        } else {
          ipObj.Network.push(instance.address)
        }
      }
    })
  }
  return ipObj
}

/**
 * 获取空闲的http端口
 * @param {number} port 端口号
 * @return {Promise<number>} 端口号
 */
exports.getPort = (port = 2000) => {
  const net = require('net')
  const loop = (port) => {
    return new Promise((resolve, reject) => {
      const server = net.createServer()
      server.listen(port)
      server.on('listening', () => {
        server.close()
        resolve(port)
      })
      server.on('error', () => {
        loop(port + 1).then(resolve).catch(reject)
      })
    })
  }
  return loop(port)
}

/**
 * 获取配置项
 * @return {Object} option
 * @return {string} option.dir: 数据存放的目录，它应该是一个相对 cwd 的路径
 */
 exports.getOption = () => {
  const process = require('process')
  const path = require('path')
  const cwd = process.cwd()

  let option = undefined
  try {
    // 第一优先级
    option = require(path.resolve(cwd, './data-dic.config.js'))
  } catch {
    // no such file
  }
  if (!option) {
    try {
      option = require(path.resolve(cwd, './package.json'))['data-dic']
    } catch {
      // no such file
    }
  }
  // 配置大于约定
  option = Object.assign({
    database: path.resolve(__dirname, '../database'),
    static: path.resolve(__dirname, '../static'),
    prefix: '/data-dic'
  }, option)
  return option
}