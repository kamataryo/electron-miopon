const url = require('url')
const qsparse = urlstring => {
  const { query } = url.parse(urlstring, true)
  return query
}

const parseHash = urlstring => {
  const { hash } = url.parse(urlstring)

  // remove '#'
  const hashstring = hash[0] === '#' ? hash.replace('#', '') : hash

  return hashstring.split('&').reduce((prev, kvp) => {
    const [key, value] = kvp.split('=')
    return { ...prev, [decodeURIComponent(key)]: decodeURIComponent(value) }
  }, {})
}

const qsjoin = params =>
  Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')

module.exports = qsjoin

module.exports = { qsparse, qsjoin, parseHash }
