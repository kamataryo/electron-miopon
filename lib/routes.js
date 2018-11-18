const { BrowserWindow } = require('electron')
const path = require('path')

const opened = {}

const openView = name => {
  const htmlPath = path.join(__dirname, '..', 'views', `${name}.html`)
  if (!opened[htmlPath]) {
    opened[htmlPath] = true
    const win = new BrowserWindow({ width: 300, height: 600 })
    win.loadFile(htmlPath)
    win.on('close', () => (opened[htmlPath] = false))
    return win
  } else {
    return false
  }
}

module.exports = { openView }
