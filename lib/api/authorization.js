const { BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const crypto = require('crypto')
const { qsparse, parseHash, qsjoin } = require('../url')
const Store = require('../store')
const { openView } = require('../routes')
const endpoint = 'https://api.iijmio.jp/mobile/d/v1/authorization'

module.exports = developerId =>
  new Promise((resolve, reject) => {
    const nonce = crypto.randomBytes(16).toString('base64')
    const win = new BrowserWindow({ width: 300, height: 600 })

    let confitmedDeveloperId

    if (developerId) {
      confitmedDeveloperId = developerId
      const params = {
        response_type: 'token',
        client_id: developerId,
        state: nonce,
        redirect_uri: 'localhost'
      }
      win.loadURL(`${endpoint}?${qsjoin(params)}`)
    } else {
      const win = openView('developer-id')

      // send from developer-id.html
      ipcMain.on('developer_id', (event, developerId) => {
        confitmedDeveloperId = developerId
        const params = {
          response_type: 'token',
          state: nonce,
          client_id: developerId,
          redirect_uri: 'localhost',
          internalNavigate: true
        }
        win.loadURL(`${endpoint}?${qsjoin(params)}`)
      })
    }

    win.webContents.on('will-navigate', (event, url) => {
      const { internalNavigate } = qsparse(url)
      const { access_token, expires_in, state } = parseHash(url)
      if (state === nonce) {
        // confirm session https://www.iijmio.jp/hdd/coupon/mioponapi.jsp
        const expiresAt = Date.now() + expires_in * 1000
        event.preventDefault()
        win.close()
        resolve({
          developerId: confitmedDeveloperId,
          accessToken: access_token,
          expiresAt
        })
      } else {
        reject({ type: 'NounceNotMatched' })
      }
    })
  })
