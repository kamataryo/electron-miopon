const { app } = require('electron')
const axios = require('axios')
const { setTray } = require('./tray')

const configureElectron = () => {
  app.dock.hide()
  app.on('window-all-closed', () => {
    /* noop */
    // as a default, App will be quit when closing window, such as License or Preference
  })
}

const configureApp = (developerId, accessToken) => {
  setTray()
  axios.defaults.headers.common['X-IIJmio-Developer'] = developerId
  axios.defaults.headers.common['X-IIJmio-Authorization'] = accessToken
  axios.defaults.headers.put['Content-Type'] = 'appication/json'
}

module.exports = { configureElectron, configureApp }
