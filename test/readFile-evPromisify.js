'use strict'

const fs = require('fs')

const evPromise = require('..')
const tapeRunner = require('./tapeRunner')(__filename)

const FileContents = fs.readFileSync(__filename, 'utf8')

const FSreadFile = evPromise.promisify(fs.readFile)

tapeRunner(function testReadFile (t) {
  readFile(__filename, (error, value) => {
    t.notok(error, 'error should be null')
    t.equal(value, FileContents, 'value should be file contents')
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
  const { error, value } = await FSreadFile(fileName, 'utf8')
  return test(error, value)
}
