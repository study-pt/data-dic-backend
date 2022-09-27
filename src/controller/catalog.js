const { success, error } = require('../data/base')
const response = require('../utils/response')
const catalog = require('../model/catalog')
const { setting } = require('../data/setting')

exports.get = async (ctx) => {
  const data = await catalog.get()
  response(ctx, success(null, data.data))
}

exports.put = async (ctx) => {
  const params = JSON.parse(ctx.request.body)
  const data = await catalog.get()

  if (params.filepath === '/base' && params.name !== 'base') {
    response(ctx, error('不可修改元数据目录名称'))
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

  const { index, parent } = catalog.find(data.data, params.filepath)
  if (index === -1) {
    response(ctx, error(`目录 ${params.filepath} 不存在`))
    return
  }
  if (parent.children[index].name !== params.name) {
    if (!checkName(parent.children, params.name)) {
      return
    }
    temp.filepath = parent.filepath + '/' + params.name
    // 更新文件目录名称
    await catalog.rename(setting.database, params.filepath, temp.filepath)
    
  }

  Object.assign(parent.children[index], temp)
  await catalog.update(data)
  response(ctx, success('目录修改成功', data.data))
}

exports.post = async (ctx) => {
  const params = JSON.parse(ctx.request.body)
  const data = await catalog.get()

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
    isdir: params.isdir === undefined ? true : params.isdir
  }
  if (!params.filepath) {
    if (!checkName(data.data.children, params.name)) {
      return
    }
    data.data.children.push(temp)
  } else {
    const { parent, index } = catalog.find(data.data, params.filepath)
    if (index === -1) {
      response(ctx, error('父级目录 ' + params.filepath + ' 不存在！'))
      return
    }
    if (!checkName(parent.children[index].children, params.name)) {
      return
    }
    parent.children[index].children.push(temp)
  }
  
  await catalog.add(setting.database, filepath)
  catalog.update(data)
  response(ctx, success('目录创建成功', data.data))
}

exports.delete = async (ctx) => {
  const filepath = ctx.query.filepath
  if (filepath === '/base') {
    response(ctx, error('请勿删除元数据目录'))
    return
  }
  const data = await catalog.get()
  const { index, parent } = catalog.find(data.data, filepath)
  if (index === -1) {
    response(ctx, error('你正在试图删除不存在的filepath: ' + filepath))
  } else {
    const removed = parent.children.splice(index, 1)[0]
    await catalog.update(data)
    await catalog.delete(setting.database, removed)
    response(ctx, success('删除成功', data.data))
  }
}