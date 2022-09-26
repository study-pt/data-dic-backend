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
  const params = JSON.parse(ctx.request.body)
  const data = catalog.get()

  if (params.filepath === '/base') {
    response(ctx, error('不可修改元数据目录'))
    return
  }

  const checkName = (parent, name) => {
    if (parent.find(ele => ele.name === name)) {
      response(ctx, error('目录已存在，请换个名称吧'))
      return false
    }
    return true
  }

  const temp = {
    name: params.name,
    filepath: params.filepath,
    alias: params.alias || null,
    sort: params.sort,
  }

  const { index, parent } = catalog.find(data.data.children, params.filepath)
  if (!parent) {
    response(ctx, error(`目录 ${params.filepath} 不存在`))
    return
  }
  if (parent[index].name !== params.name && !checkName(parent, params.name)) {
    return
  }

  Object.assign(parent[index], temp)
  catalog.update(data)
  // TODO: 可能需要更新重命名文件夹
  response(ctx, success('目录修改成功', data))
}

exports.post = async (ctx) => {
  const params = JSON.parse(ctx.request.body)
  const data = catalog.get()

  const checkName = (parent, name) => {
    if (parent.find(ele => ele.name === name)) {
      response(ctx, error('目录已存在，请换个名称吧'))
      return false
    }
    return true
  }
  const filepath = params.filepath + '/' + params.name
  const temp = {
    name: params.name,
    filepath,
    alias: params.alias || null,
    sort: params.sort,
    isdir: true
  }
  if (!params.filepath) {
    if (!checkName(data.data.children, params.name)) {
      return
    }
    data.data.children.push(temp)
  } else {
    const { parent } = catalog.find(data.data.children, params.filepath)
    if (!parent) {
      response(ctx, error('父级目录不存在！'))
      return
    }
    if (!checkName(parent, params.name)) {
      return
    }
    parent.push(temp)
  }
  
  await catalog.add(setting.database, filepath)
  catalog.update(data)
  response(ctx, success('目录创建成功', data))
}

exports.delete = async (ctx) => {
  const filepath = ctx.query.filepath
  if (filepath === '/base') {
    response(ctx, error('请勿删除元数据目录'))
    return
  }
  const data = catalog.get()
  const { index, parent } = catalog.find(data.data.children, filepath)
  if (index === -1) {
    response(ctx, error('你正在试图删除不存在的filepath: ' + filepath))
  } else {
    const removed = parent.splice(index, 1)[0]
    catalog.update(data)
    response(ctx, success('删除成功', data.data))
    catalog.delete(setting.database, removed)
  }
}