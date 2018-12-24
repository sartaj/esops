const fs = require('fs')
const marked = require('marked')
const TerminalRenderer = require('marked-terminal')
const {announce} = require('./announce')

marked.setOptions({
  renderer: new TerminalRenderer(),
  gfm: true
})

export const mdString = marked

export const md = string => {
  const mdString = marked(string).slice(0, -2) // slice is to remove created new-lines created by marked.

  announce(mdString, {
    align: 'left',
    float: 'left',
    margin: 1,
    padding: 1
  })
}

export const mdFile = async path => {
  const str = fs.readFileSync(path, {encoding: 'utf-8'})
  md(str)
}
