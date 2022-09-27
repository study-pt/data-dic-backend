const { success, error } = require('../data/base')
const response = require('../utils/response')
const common = require('../model/common')

exports.get = async (ctx) => {
  const catalog = ctx.query.filepath
  if (!catalog) {
    response(ctx, error('缺少必要字段：filepath'))
    return
  }
  try {
    const res = await common.get(catalog)
    response(ctx, success(null, res))
  } catch (err) {
    response(ctx, error(err))
  }
}

exports.put = () => {
  const catalog = ctx.query.filepath
  if (!catalog) {
    response(ctx, error('缺少必要字段：filepath'))
    return
  }
}

exports.post = () => {}

exports.delete = () => {}