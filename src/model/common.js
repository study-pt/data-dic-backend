const common = require('../data/common')
const { setting } = require('../data/setting')
const path = require('path')

exports.get = (catalog) => common.get(path.resolve(setting.database, catalog))

exports.getSwagger = () => common.get(path.resolve(__dirname, '../../swagger/swagger.html'))