var browserslist = require('../')

var originData = browserslist.data
var originWarn = console.warn

beforeEach(() => {
  browserslist.data = {
    ie: {
      name: 'ie',
      versions: ['1', '2', '3'],
      releaseDate: {
        '1': 0, // Thu, 01 Jan 1970 00:00:00 +0000
        '2': 1483228800, // Sun, 01 Jan 2017 00:00:00 +0000
        '3': 1485907200 // Wed, 01 Feb 2017 00:00:00 +0000
      }
    }
  }
  console.warn = function () {
    if (
      typeof arguments[0] === 'string' &&
      (
        /yarn upgrade/.test(arguments[0]) ||
        /npm update/.test(arguments[0])
      )
    ) {
      return
    }
    originWarn.apply(this, arguments)
  }
})

afterEach(() => {
  browserslist.data = originData
  console.warn = originWarn
})

it('selects versions released on year boundaries', () => {
  expect(browserslist('since 1970')).toEqual(['ie 3', 'ie 2', 'ie 1'])
})

it('is case insensitive', () => {
  expect(browserslist('Since 1970')).toEqual(['ie 3', 'ie 2', 'ie 1'])
})

it('selects versions released on year and month boundaries', () => {
  expect(browserslist('since 2017-01')).toEqual(['ie 3', 'ie 2'])
})

it('selects versions released on date boundaries', () => {
  expect(browserslist('since 2017-02-01')).toEqual(['ie 3'])
})
