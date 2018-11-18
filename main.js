const Store = require('./lib/store')
const path = require('path')
const { getAccessToken, setAccessToken } = require('./lib/keychain')
const oAuth = require('./lib/o-auth')
const { app, Menu, Tray } = require('electron')
const axios = require('axios')
const { formatCouponInfo } = require('./lib/format')
const store = new Store({ configName: 'user-data' })
const EXPIRES_AT = 'expires_at'

Promise.all([getAccessToken(), store.get(EXPIRES_AT)])
  .catch(err => console.log(err.type))
  .then((result = []) => {
    const [accessToken, expiresAt] = result
    const isExpired = Date.now() > expiresAt
    return !accessToken || isExpired ? oAuth() : { accessToken, expiresAt }
  })
  .then(({ accessToken, expiresAt }) => {
    store.set(EXPIRES_AT, expiresAt)
    return setAccessToken(accessToken)
  })
  .then(({ accessToken, developerId }) => {
    axios.defaults.headers.common['X-IIJmio-Developer'] = developerId
    axios.defaults.headers.common['X-IIJmio-Authorization'] = accessToken
    axios.defaults.headers.put['Content-Type'] = 'appication/json'

    const iconName = 'iconTemplate.png'
    const iconPath = path.join(__dirname, iconName)
    const appIcon = new Tray(iconPath)
    app.on('window-all-closed', () => appIcon && appIcon.destroy())

    let counter = 0

    setInterval(() => {
      // クーポン残量照会・クーポンのON/OFF状態照会 5 requests/min.
      axios.get('https://api.iijmio.jp/mobile/d/v2/coupon/').then(res => {
        if (res.data.returnCode === 'OK') {
          counter++
          const info = formatCouponInfo(res.data.couponInfo)
          const labels = Object.keys(info).map(id => ({
            label: `${id}: 残り${info[id]}MB`
          }))
          const contextMenu = Menu.buildFromTemplate([
            { label: `リクエスト回数: ${counter}` },
            ...labels
          ])
          appIcon.setToolTip('test')
          appIcon.setContextMenu(contextMenu)
        }
      })
    }, 30 * 1000)

    // // クーポンのON/OFF 1 request / min.
    // axios.put('https://api.iijmio.jp/mobile/d/v2/coupon/').then(console.log)

    // データ利用量照会 5 requests / min.
    // axios
    //   .get('https://api.iijmio.jp/mobile/d/v2/log/packet/')
    //   .then(res => console.log(res.data))
  })
