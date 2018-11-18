const keychain = require('keychain')
const { IIJMIO_DEVELOPER_ID: developerId } = process.env

const getAccessToken = () =>
  new Promise((resolve, reject) =>
    keychain.getPassword(
      { account: 'foo', service: 'com.kamataryo.electron-miopon' },
      (err, access_token) => (err ? reject(err) : resolve(access_token))
    )
  )

const setAccessToken = accessToken =>
  new Promise((resolve, reject) =>
    keychain.setPassword(
      {
        account: 'foo',
        service: 'com.kamataryo.electron-miopon',
        password: accessToken
      },
      err => (err ? reject(err) : resolve({ accessToken, developerId }))
    )
  )

module.exports = { getAccessToken, setAccessToken }
