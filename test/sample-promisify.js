'use strict'

const evpromise = require('..')

const addAsync = evpromise.promisify(add)

run('250', 500)   // prints 'x is not a number'
run(250, 250)     // prints '250 + 250: 500'

async function run (x, y) {
  const result = await addAsync(x, y)
  if (result.error) return console.log(result.error.message)

  console.log(`${x} + ${y}: ${result.value}`)
}

function add (x, y, cb) {
  if (typeof x !== 'number') return setImmediate(cb, new Error('x is not a number'))
  if (typeof y !== 'number') return setImmediate(cb, new Error('y is not a number'))
  setImmediate(cb, null, x + y)
}
