const { app } = require('electron')
const Store = require('./lib/store')
const { getAccessToken, setAccessToken } = require('./lib/keychain')
const oAuth = require('./lib/o-auth')
const axios = require('axios')
const store = new Store({ configName: 'user-data' })
const configure = require('./lib/configure')
const { updateTray } = require('./lib/tray')
const EXPIRES_AT = 'expires_at'
const DEVELOPER_ID = 'developer_id'

const request = () =>
  axios
    .get('https://api.iijmio.jp/mobile/d/v2/coupon/')
    .then(({ data }) => updateTray(data))

Promise.all([
  app.whenReady(),
  getAccessToken(),
  store.get(EXPIRES_AT),
  store.get(DEVELOPER_ID)
])
  .catch(err => console.log(err.type))
  .then(result => {
    const [_0, accessToken, expiresAt, developerId] = result
    const isExpired = Date.now() > expiresAt

    return !accessToken || isExpired || !developerId
      ? oAuth(developerId)
      : { developerId, accessToken, expiresAt }
  })
  .then(({ developerId, accessToken, expiresAt }) => {
    // store data
    store.set(DEVELOPER_ID, developerId)
    setAccessToken(accessToken)
    store.set(EXPIRES_AT, expiresAt)

    // configure app
    configure(developerId, accessToken)

    // start loop
    request()
    setInterval(request, 60 * 1000)

    // // クーポンのON/OFF 1 request / min.
    // axios.put('https://api.iijmio.jp/mobile/d/v2/coupon/').then(console.log)

    // データ利用量照会 5 requests / min.
    // axios
    //   .get('https://api.iijmio.jp/mobile/d/v2/log/packet/')
    //   .then(res => console.log(res.data))
  })
