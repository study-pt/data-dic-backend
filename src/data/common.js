const fs = require('fs').promises

exports.get = async (path) => await fs.readFile(path, 'utf-8')