const { app } = require('electron')
const { configureElectron, configureApp } = require('./lib/configure')
const { getAccessToken, setAccessToken } = require('./lib/keychain')
const Store = require('./lib/store')
const authorization = require('./lib/api/authorization')
const getCouponInfo = require('./lib/api/coupon')

const store = new Store({ configName: 'user-data' })
const { updateTray } = require('./lib/tray')
const EXPIRES_AT = 'expires_at'
const DEVELOPER_ID = 'developer_id'

const request = () =>
  getCouponInfo()
    .then(({ data }) => updateTray(data))
    .catch(() => updateTray([]))

Promise.all([
  app.whenReady(),
  getAccessToken(),
  store.get(EXPIRES_AT),
  store.get(DEVELOPER_ID),
])
  .catch(err => console.log(err.type))
  .then(result => {
    configureElectron()

    const [, accessToken, expiresAt, developerId] = result
    const isExpired = Date.now() > expiresAt

    return !accessToken || isExpired || !developerId
      ? authorization(developerId)
      : { developerId, accessToken, expiresAt }
  })
  .then(({ developerId, accessToken, expiresAt }) => {
    // store data
    store.set(DEVELOPER_ID, developerId)
    setAccessToken(accessToken)
    store.set(EXPIRES_AT, expiresAt)

    configureApp(developerId, accessToken)

    // start loop
    request()
    setInterval(request, 60 * 1000 * 20) // once a 20 min.

    // // クーポンのON/OFF 1 request / min.
    // axios.put('https://api.iijmio.jp/mobile/d/v2/coupon/').then(console.log)

    // データ利用量照会 5 requests / min.
    // axios
    //   .get('https://api.iijmio.jp/mobile/d/v2/log/packet/')
    //   .then(res => console.log(res.data))
  })
