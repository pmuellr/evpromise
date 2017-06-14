'use strict'

const fs = require('fs')

const evPromise = require('..')
const tapeRunner = require('./tapeRunner')(__filename)

const FileContents = fs.readFileSync(__filename, 'utf8')

const FSopen = evPromise.promisify(fs.open)
const FSfstat = evPromise.promisify(fs.fstat)
const FSread = evPromise.promisify(fs.read)
const FSclose = evPromise.promisify(fs.close)

tapeRunner(function testReadFile (t) {
  readFile(__filename, (error, value) => {
    t.notok(error, 'error should be null')
    t.equal(value.toString('utf8'), FileContents, 'value should be file contents')
    t.end()
  })
})

tapeRunner(function testNonExistantFile (t) {
  readFile(`${__filename}.nope`, (error, value) => {
    t.ok(error instanceof Error, 'error should be an Error')
    t.notok(value, 'value should be null')
    t.end()
  })
})

async function readFile (fileName, test) {
  let result

  result = await FSopen(fileName, 'r')
  if (result.error) return test(result.error)
  const fd = result.value

  result = await FSfstat(fd)
  if (result.error) return test(result.error)
  const stats = result.value

  const buffer = new Buffer(stats.size)

  result = await FSread(fd, buffer, 0, buffer.length, 0)
  if (result.error) return test(result.error)
  const { bytesRead } = result.value
  if (bytesRead !== buffer.length) return test(new Error('EMOREFILE'))

  result = await FSclose(fd)
  if (result.error) return test(result.error)

  test(null, buffer)
}
