const getPackageName = require('../../src/getPackageName')

describe('getPackageName module', () => {
  test('should return the unaltered package name if alrady given', () => {
    expect(getPackageName('reggie')).toBe('reggie')
    expect(getPackageName('are-we-there-yet-1.1.2.tgz')).toBe('are-we-there-yet')
    expect(getPackageName('reggie@next')).toBe('reggie')
  })
  test('should return the correct package name if inside a .tgz', () => {
    expect(getPackageName('are-we-there-yet-1.1.2.tgz')).toBe('are-we-there-yet')
  })
  test('should return the correct package name if uses a @/ naming', () => {
    expect(getPackageName('reggie@next')).toBe('reggie')
  })
})
