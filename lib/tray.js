const { app, Menu, Tray, shell } = require('electron')
const path = require('path')
const { formatCoupon } = require('./format')
const { openView } = require('./routes')
const { removeAccessToken } = require('./keychain')

let tray // against GC, define here

const defaultLabels = [
  { type: 'separator' },
  {
    label: 'open user data folder',
    click: () => shell.openItem(app.getPath('userData')),
  },
  { label: 'License', click: () => openView('license') },
  { label: 'signout', click: () => removeAccessToken() },
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
    const services = formatCoupon(data.couponInfo)
    labels = services
      .map(service =>
        service.phones
          .map((phone, index) => {
            if (index === 0) {
              return { label: `${phone.phoneNumber}: 残り${service.giga}MB` }
            } else {
              return { label: `${phone.phoneNumber}` }
            }
          })
          .concat([{ type: 'separator' }]),
      )
      .reduce((prev, item) => [...prev, ...item], [])
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
