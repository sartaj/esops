const {npmCompose} = require('./esops-npm')

if (!module.parent) {
  npmCompose('yarn')
}
