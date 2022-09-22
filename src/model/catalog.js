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
  let finder = -1
  let parent = null
  const loop = (arr = []) => {
    const len = arr.length
    let i = 0
    while (i < len && finder === -1) {
      const item = arr[i]
      if (item.filepath === filepath) {
        finder = i
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
    finder,
    parent
  }
}

exports.update = (data) => catalog.post(data)

exports.add = (data) => {
  
}

exports.delete = (database, file) => {
  if (file.isdir) {
    return catalog.delDir(path.join(database, file.filepath))
  }
  return catalog.del(path.join(database, file.filepath))
}