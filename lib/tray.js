const { app, Menu, Tray } = require('electron')
const path = require('path')
const { formatCouponInfo } = require('./format')
const { openView } = require('./routes')

let tray // against GC, define here

const defaultLabels = [
  { type: 'separator' },
  { label: 'License', click: () => openView('license') },
  { type: 'separator' },
  { label: 'Quit Electron Miopon', click: app.quit },
]

const setTray = () => {
  const iconName = 'simTemplate.png'
  const iconPath = path.join(__dirname, '..', 'assets', iconName)
  tray = new Tray(iconPath)
  tray.setToolTip('Electron Miopon')
}

const updateTray = data => {
  let labels
  if (data.returnCode === 'OK') {
    const info = formatCouponInfo(data.couponInfo)
    labels = Object.keys(info).map(id => ({
      label: `${id}: 残り${info[id]}MB`,
    }))
  } else {
    labels = [
      {
        label: 'Network Error',
      },
    ]
  }
  const contextMenu = Menu.buildFromTemplate(labels.concat(defaultLabels))
  tray.setContextMenu(contextMenu)
}

module.exports = { setTray, updateTray }
