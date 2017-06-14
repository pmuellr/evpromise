'use strict'

const util = require('util')

module.exports.promisify = promisify
module.exports.toEVPromise = toEVPromise

// return a new Promise which never rejects, calls object with error / value on resolve
function toEVPromise (promise) {
  let resolveFn
  const evPromise = new Promise(resolver)
  evPromise.isEVPromise = true

  promise
    .then(value => setImmediate(resolveFn, { value: value }))
    .catch(error => setImmediate(resolveFn, { error: error }))

  return evPromise

  function resolver (resolve) {
    resolveFn = resolve
  }
}

// like util.promisify, but returns an EVPromise
function promisify (fn) {
  const fnp = util.promisify(fn)

  return function () {
    const args = Array.from(arguments)
    const promise = fnp.apply(this, args)

    return toEVPromise(promise)
  }
}
