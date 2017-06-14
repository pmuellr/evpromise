'use strict'

const evpromise = require('..')

// prints "1: promise resolved: 42"
wait(null, 42).then(({error, value}) => {
  if (error) return console.log('1: error occurred:', error)
  console.log('1: promise resolved:', value)
})

// prints "2: error occurred: 43"
wait(43, null).then(({error, value}) => {
  if (error) return console.log('2: error occurred:', error)
  console.log('2: promise resolved:', value)
})

function wait (error, value) {
  const promise = new Promise((resolve, reject) => {
    setTimeout(
      () => { error ? reject(error) : resolve(value) },
      100
    )
  })

  return evpromise.toEVPromise(promise)
}
