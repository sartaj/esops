const test = require('ava')
const authorizeGithub = require('./')

test('authorizeGithub › should be an AsyncFunction', t => {
  t.is(authorizeGithub.constructor.name, 'AsyncFunction')
})

test.todo('actual github request needs more tests')
