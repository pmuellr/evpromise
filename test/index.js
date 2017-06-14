'use strict'

require('./resolve')
require('./reject')

// tests requiring node v8 for async/await
if (process.version.match(/^v8/)) {
  require('./readFile-evPromisify')
  require('./readFile-manual-evPromisify')
}
