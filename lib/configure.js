const { app, Menu } = require('electron')
const axios = require('axios')
const { setTray } = require('./tray')

const configureElectron = () => {
  app.dock.hide()
  app.on('window-all-closed', () => {
    /* noop */
    // as a default, App will be quit when closing window, such as License or Preference
  })
  createMenu()
}

const configureApp = (developerId, accessToken) => {
  setTray()
  axios.defaults.headers.common['X-IIJmio-Developer'] = developerId
  axios.defaults.headers.common['X-IIJmio-Authorization'] = accessToken
  axios.defaults.headers.put['Content-Type'] = 'appication/json'
}

const createMenu = () => {
  const application = {
    label: 'Application',
    submenu: [
      {
        label: 'About Application',
        selector: 'orderFrontStandardAboutPanel:',
      },
      {
        type: 'separator',
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: () => {
          app.quit()
        },
      },
    ],
  }

  const edit = {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        selector: 'undo:',
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        selector: 'redo:',
      },
      {
        type: 'separator',
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        selector: 'cut:',
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        selector: 'copy:',
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        selector: 'paste:',
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        selector: 'selectAll:',
      },
    ],
  }

  const template = [application, edit]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

module.exports = { configureElectron, configureApp }
