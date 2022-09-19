/**
 * 获取network ip
 * @return {Array<string>} ip list
 */
exports.getIp = () => {
  const ips = []
  const interfaces = require('os').networkInterfaces()
  for (const k in interfaces) {
    interfaces[k].forEach(instance => {
      if (instance.family === 'IPv4' && instance.internal) {
        ips.push(instance.address)
      }
    })
  }
  return ips
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