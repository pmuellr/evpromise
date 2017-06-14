evpromise - promises that always resolve with error / value, and never reject
================================================================================

This package supports a different flavored Promise than you're used to: they
never reject.  Instead, they always resolve with an object which has either an
`error` property or a `value` property.  The `value` is what you would get via
`then()` when the promise is resolved, and the `error` is what you would get via
`catch()` when the promise is rejected.  Since it never rejects, you won't
have to wrap your `async` / `await` invocations in `try` / `catch` blocks.

You can create one of these promises from an existing promise, or make use of
the Node v8.x.y `util.promisify` functionality to have an existing "errback"
function return an one of these Promises.  We'll call them EVPromises - Error
Value Promises.

They're real Promises!

Why do this?  It's an experiment to see if this "inline" style of handling
success / failure in async is any easier / nicer / more understandable than
the usual promise and async / await patterns.

Inspired by ["How to write async await without try-catch blocks in
Javascript"][async-no-try] and [other][yield-callback] [attempts][await-callback]
I've made with different async invocation patterns.

[async-no-try]: http://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
[yield-callback]: https://github.com/pmuellr/yield-callback
[await-callback]: https://github.com/pmuellr/await-callback

example
================================================================================

Here's an example of wrapping a promise as an EVPromise:

```js
const evpromise = require('evpromise')

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
```

Here's an example of using the `promisify` function to create a function that
can be used with `async` / `await`:

```js
const evpromise = require('evpromise')

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
```


install
================================================================================

    npm install pmuellr/evpromise


API
================================================================================

This module exports two functions described below.


`toEVPromise(promise)`
--------------------------------------------------------------------------------

Returns a new Promise object which will only resolve and never reject.

When the promise passed in resolves, the returned promise will resolve with an
object that has a `value` property with the resolved value.

When the promise passed in rejects, the returned promise will resolve with an
object that has an `error` property with the rejected value.


`promisify(fn)`
--------------------------------------------------------------------------------

Calls [`util.promisify()`][util-promisify] on the function passed in, and
wraps that function in a function returned as the result.  The returned
function, when invoked, will return the promise from the `util.promisify()`-ified
function, converted to an EVPromise via `toEVPromise()` (described above).

[util-promisify]: https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original
