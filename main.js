const Store = require('./lib/store')
const { getAccessToken, setAccessToken } = require('./lib/keychain')
const oAuth = require('./lib/o-auth')
const store = new Store({ configName: 'user-data' })
const EXPIRES_AT = 'expires_at'

// NOTE: 初回認証時にプロセスが落ちてしまう

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
