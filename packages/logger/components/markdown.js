import fs from 'fs'
import marked from 'marked'
import TerminalRenderer from 'marked-terminal'
import announce from './announce'

marked.setOptions({
  renderer: new TerminalRenderer()
})

export const md = string => {
  announce(marked(string), {
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
