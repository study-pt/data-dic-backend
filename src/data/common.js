const fs = require('fs').promises

exports.get = async (path) => JSON.parse(await fs.readFile(path, 'utf-8'))