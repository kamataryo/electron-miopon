const electron = require('electron')
const path = require('path')
const fs = require('fs')

const parseDataFile = (filePath, defaults) => {
  try {
    return JSON.parse(fs.readFileSync(filePath))
  } catch (error) {
    return defaults
  }
}

class Store {
  constructor(opts) {
    const userDataPath = (electron.app || electron.remote.app).getPath(
      'userData'
    )
    this.__path = path.join(userDataPath, opts.configName + '.json')
    this.__data = parseDataFile(this.__path, opts.defaults) || {}
  }

  get(key) {
    return this.__data[key]
  }

  set(key, val) {
    this.__data[key] = val
    fs.writeFileSync(this.__path, JSON.stringify(this.__data))
  }
}

module.exports = Store
