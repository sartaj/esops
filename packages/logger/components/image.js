import termImg from 'term-img'
import path from 'path'
import { announce } from './announce'

export const image = (src, { alt, ...opts }) =>
  termImg(src, {
    ...opts,
    height: opts.height || 2,
    fallback:
      opts.fallback || opts.alt
        ? () => {
            console.log(alt)
          }
        : () => {}
  })

export const imageString = (src, { alt, ...opts }) =>
  termImg.string(src, {
    height: opts.height || 2,
    fallback: opts.alt ? () => alt : () => {},
    ...opts
  })

export const carlton = () =>
  image(path.join(__dirname, 'carlton.gif'), { height: 8 })
