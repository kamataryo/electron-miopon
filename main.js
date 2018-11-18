const Store = require('./lib/store')
const { getAccessToken, setAccessToken } = require('./lib/keychain')
const oAuth = require('./lib/o-auth')
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
    axios.defaults.headers.put['Content-Type'] = 'appication/jsonn'

    // setInterval(() => {
    // クーポン残量照会・クーポンのON/OFF状態照会 5 requests/min.
    axios
      .get('https://api.iijmio.jp/mobile/d/v2/coupon/')
      .then(
        res =>
          res.data.returnCode === 'OK' &&
          console.log(formatCouponInfo(res.data.couponInfo))
      )
    // }, 30 * 1000)

    // // クーポンのON/OFF 1 request / min.
    // axios.put('https://api.iijmio.jp/mobile/d/v2/coupon/').then(console.log)

    // データ利用量照会 5 requests / min.
    // axios
    //   .get('https://api.iijmio.jp/mobile/d/v2/log/packet/')
    //   .then(res => console.log(res.data))
  })
