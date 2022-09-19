const {
  getIp,
  getPort
} = require('../src/utils')

const getIpTest = () => {
  const reg = /[0-9\.a-z]+/
  test.each(getIp())('got ip %s', str => {
    expect(str).toMatch(reg)
  })
}

getIpTest()

test('get useable port', () => {
  return getPort().then(port => {
    expect(port).not.toBeNaN()
  })
})