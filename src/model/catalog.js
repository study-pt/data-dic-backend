const catalog = require('../data/catalog')
const path = require('path')


exports.get = () => catalog.get()

exports.getNew = (database) => {
  const loop = async (filepath = '', name = 'root') => {
    const temp = {
      name,
      filepath,
      alias: null,
      sort: null,
      isdir: true
    }
    try {
      const files = await catalog.getDir(path.join(database, filepath))
      temp.children = files.length ? await Promise.all(files.map(file => loop(filepath + '/' + file, file))) : []
    } catch {
      temp.isdir = false
    }
    return temp
  }
  return loop()
}

exports.find = (data = [], filepath) => {
  let index = -1
  let parent = null
  const loop = (arr = []) => {
    const len = arr.length
    let i = 0
    while (i < len && index === -1) {
      const item = arr[i]
      if (item.filepath === filepath) {
        index = i
        parent = arr
        break
      } else if (item.isdir) {
        loop(item.children)
      }
      i++
    }
  }
  loop(data)
  return {
    index,
    parent
  }
}

exports.update = (data) => catalog.post(data)

exports.add = (database, filepath) => catalog.addDir(path.join(database, filepath))

exports.delete = (database, file) => {
  if (file.isdir) {
    return catalog.delDir(path.join(database, file.filepath))
  }
  return catalog.del(path.join(database, file.filepath))
}