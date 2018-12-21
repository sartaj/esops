const termImg = require('term-img')
const path = require('path')

export const image = (src, {alt, height, ...opts}) =>
  termImg(src, {
    ...opts,
    height: height || 2,
    fallback:
      opts.fallback || alt
        ? () => {
            console.log(alt)
          }
        : () => {}
  })

export const imageString = (src, {alt, ...opts}) =>
  termImg.string(src, {
    height: opts.height || 2,
    fallback: opts.alt ? () => alt : () => {},
    ...opts
  })

export const carlton = () =>
  image(path.join(__dirname, '../../../../', 'assets', 'carlton.gif'), {
    alt: '',
    height: 16
  })
