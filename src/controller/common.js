const { success, error } = require('../data/base')
const response = require('../utils/response')
const common = require('../model/common')

exports.get = async (ctx) => {
  const catalog = ctx.query.catalog
  if (!catalog) {
    response(ctx, error('缺少必要字段：catalog'))
    return
  }
  try {
    const res = await common.get(catalog)
    response(ctx, success(null, res))
  } catch (err) {
    response(ctx, error(err))
  }
}

exports.put = () => {}

exports.post = () => {}

exports.delete = () => {}