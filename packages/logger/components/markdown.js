import fs from 'fs'
import marked from 'marked'
import TerminalRenderer from 'marked-terminal'
import { announce } from './announce'

marked.setOptions({
  renderer: new TerminalRenderer(),
  gfm: true
})

export const md = string => {
  const mdString = marked(string).slice(0, -2) // slice is to remove created new-lines created by marked.

  announce(mdString, {
    align: 'left',
    float: 'center',
    margin: 2,
    padding: 2
  })
}

export const mdFile = async path => {
  const str = fs.readFileSync(path, { encoding: 'utf-8' })
  md(str)
}
