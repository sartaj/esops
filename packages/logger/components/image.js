import termImg from 'term-img'
import path from 'path'

export const image = ({ src, alt, ...opts }) =>
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

export const carlton = () => image(path.join(__dirname, '/carlton.gif'))
