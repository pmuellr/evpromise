'use strict'

const evPromise = require('..')
const tapeRunner = require('./tapeRunner')(__filename)

tapeRunner(function resolve (t) {
  const p1 = new Promise(resolver)
  const p2 = evPromise.toEVPromise(p1)

  p2
    .then(({error, value}) => {
      t.equal(value, 42, 'value should be expected value')
      t.ok(error == null, 'error should be null')
      t.end()
    })
    .catch(err => {
      t.fail(`should not reject, but did with ${err}`)
      t.end()
    })

  function resolver (resolve, reject) {
    setTimeout(() => resolve(42), 1)
  }
})
