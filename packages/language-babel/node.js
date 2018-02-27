const preset = require('./preset')

require('@babel/register')(preset())

require('@babel/polyfill')
