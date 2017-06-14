'use strict'

const evPromise = require('..')
const tapeRunner = require('./tapeRunner')(__filename)

tapeRunner(function resolve (t) {
  const p1 = new Promise(rejecter)
  const p2 = evPromise.toEVPromise(p1)

  p2
    .then(({error, value}) => {
      t.ok(value == null, 'value should be null')
      t.equal(error.message, '42', 'error should be expected value')
      t.end()
    })
    .catch(err => {
      t.fail(`should not reject, but did with ${err}`)
      t.end()
    })

  function rejecter (resolve, reject) {
    setTimeout(() => reject(new Error('42')), 1)
  }
})
