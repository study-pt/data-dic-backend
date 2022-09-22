const common = require('../data/common')
const { setting } = require('../data/setting')
const path = require('path')

exports.get = (catalog) => {
  return common.get(path.resolve(setting.database, catalog))
}