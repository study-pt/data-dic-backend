const chalk = require('../src/utils/chalk')

const end = '\x1B[0m' // 颜色终止符
const colorMap = {
  bright: '\x1B[1m',
  grey: '\x1B[2m',
  italic: '\x1B[3m', // 斜体
  underline: '\x1B[4m',
  reverse: '\x1B[7m', // 反向
  hidden: '\x1B[8m',
  black: '\x1B[30m',
  red: '\x1B[31m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  blue: '\x1B[34m',
  magenta: '\x1B[35m', // 品红
  cyan: '\x1B[36m', // 青色
  white: '\x1B[37m',
  blackBG: '\x1B[40m',
  redBG: '\x1B[41m',
  greenBG: '\x1B[42m',
  yellowBG: '\x1B[43m',
  blueBG: '\x1B[44m',
  magentaBG: '\x1B[45m', // 背景色品红
  cyanBG: '\x1B[46m', // 背景色青色
  whiteBG: '\x1B[47m', // 背景色白色
}

test('chalk(123)', () => expect(chalk('123')).toBe('123' + end))
test('chalk.red(123)', () => expect(chalk.red('123')).toBe(colorMap['red'] + '123' + end))
test('chalk.underline.red(123)', () => expect(chalk.underline.red('123')).toBe(colorMap['underline'] + colorMap['red'] + '123' + end))