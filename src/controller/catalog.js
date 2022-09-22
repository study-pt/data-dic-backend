const { success, error } = require('../data/base')
const response = require('../utils/response')
const catalog = require('../model/catalog')
const { setting } = require('../data/setting')

exports.get = async (ctx) => {
  const data = catalog.get()

  if (data.database !== setting.database) {
    // 更新并获取新的catalog data
    const newData = await catalog.getNew(setting.database)
    response(ctx, success(null, newData))
    catalog.update({
      database: setting.database,
      data: newData
    })
  } else {
    response(ctx, success(null, data.data))
  }
}

exports.put = async (ctx) => {
  const params = ctx.request.body
  response(ctx, success(null, params))
}

exports.post = async (ctx) => {
  const params = ctx.request.body
  response(ctx, success(null, params))
}

exports.delete = async (ctx) => {
  const filepath = ctx.query.filepath
  if (!filepath) {
    response(ctx, error('缺少必要字段：filepath'))
    return
  }
  const data = catalog.get()
  const { finder, parent } = catalog.find(data.data.children, filepath)
  if (finder === -1) {
    response(ctx, error('你正在试图删除不存在的filepath: ' + filepath))
  } else {
    const removed = parent.splice(finder, 1)[0]
    catalog.update(data)
    response(ctx, success('删除成功', data.data))
    catalog.delete(setting.database, removed)
  }
}