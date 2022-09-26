const path = require('path')

const fs = require('fs').promises

exports.get = () => require('./catalog.json')

exports.addDir = (dir) => fs.mkdir(dir, { recursive: true })

exports.getDir = (dir) => fs.readdir(dir, 'utf-8')

exports.post = (data) => fs.writeFile(path.resolve(__dirname, './catalog.json'), JSON.stringify(data), 'utf-8')

exports.del = (file) => fs.unlink(file)

exports.delDir = (dir) => fs.rmdir(dir, { recursive: true })