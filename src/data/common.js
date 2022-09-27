const fs = require('fs').promises

exports.get = (path) => fs.readFile(path, 'utf-8')