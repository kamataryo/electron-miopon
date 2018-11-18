const path = require('path')
const qsjoin = require('./qsjoin')
const { parseHash } = require('./qsparse')

const { IIJMIO_DEVELOPER_ID } = process.env

const endpoints = {
  authorization: 'https://api.iijmio.jp/mobile/d/v1/authorization/'
}

const nounce = 'test'

const params = {
  response_type: 'token',
  client_id: IIJMIO_DEVELOPER_ID,
  state: nounce,
  redirect_uri: 'localhost'
}
const { app, BrowserWindow } = require('electron')

module.exports = () =>
  new Promise((resolve, reject) =>
    app.whenReady().then(() => {
      const win = new BrowserWindow({ width: 800, height: 600 })
      win.loadURL(`${endpoints.authorization}?${qsjoin(params)}`)

      win.webContents.on('will-navigate', (event, url) => {
        const { access_token, expires_in, state } = parseHash(url)
        const expiresAt = Date.now() + expires_in * 1000
        event.preventDefault()
        win.close()

        // check Man-In-The-Middle Attack
        if (state === nounce) {
          resolve({ accessToken: access_token, expiresAt })
        } else {
          reject({ type: 'NounceNotMatched' })
        }
      })
    })
  )
