const termImg = require('term-img')
const path = require('path')

module.exports.image = (src, { alt, ...opts }) =>
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

module.exports.imageString = (src, { alt, ...opts }) =>
  termImg.string(src, {
    height: opts.height || 2,
    fallback: opts.alt ? () => alt : () => {},
    ...opts
  })

module.exports.carlton = () =>
  image(path.join(__dirname, 'carlton.gif'), { height: 8 })
