const path = require('path')
const { setting } = require('./setting')

const catalog = path.resolve(setting.static, './static/catalog.json')

const fs = require('fs').promises

exports.get = async () => JSON.parse(await fs.readFile(catalog, 'utf-8'))

exports.addDir = (dir) => fs.mkdir(dir, { recursive: true })

exports.getDir = (dir) => fs.readdir(dir, 'utf-8')

exports.rename = (filepath, newfilepath) => fs.rename(filepath, newfilepath)

exports.post = (data) => fs.writeFile(catalog, JSON.stringify(data), 'utf-8')

exports.del = (file) => fs.unlink(file)

exports.delDir = (dir) => fs.rmdir(dir, { recursive: true })