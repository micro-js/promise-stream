
# promise-stream

[![Build status][travis-image]][travis-url]
[![Git tag][git-image]][git-url]
[![NPM version][npm-image]][npm-url]
[![Code style][standard-image]][standard-url]

A stream interface for representing data flows with support for promises. Good for representing a value that can be recomputed. API inspired by [flyd](//github.com/paldepind/flyd).

## Installation

    $ npm install @f/promise-stream

## Usage

```js
import stream from '@f/promise-stream'

var s = stream(delay(10, 1))

co(function * () {
  yield stream.wait(s) // 1
  yield stream.wait(s) // 1
  s(delay(10, 2))
  yield stream.wait(s) // 2
})

var in1 = stream(1)
var in2 = stream(1)

var add = stream.combine(function (arg1, arg2) {
  return arg1 + arg2
}, [in1, in2])

co(function * () {
  yield stream.wait(add) // 2
  yield stream.wait(add) // 2
  in1(delay(10, 2))
  yield stream.wait(add) // 3
})

function delay (d, last) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(last)
    }, d)
  })
}

```

## API

### stream(initial)

- `initial` - initial value for stream

**Returns:** function for pushing vals on to the stream

### stream.wait(s)

- `s` - stream wait on

**Returns:** Returns val of steam after all pending promises have been resolved.

### stream.on(fn, s)

- `fn` - listen for updates to stream `s`
- `s` - stream instance

### stream.map(fn, s)

- `fn` - mapping function on values in stream `s`
- `s` - stream instance

**Returns:** a new stream

### stream.combine(fn, deps)

- `fn` - mapping function over values in streams `deps`
- `deps` - streams that `fn` depends on

**Returns:** a new stream

## License

MIT

[travis-image]: https://img.shields.io/travis/micro-js/promise-stream.svg?style=flat-square
[travis-url]: https://travis-ci.org/micro-js/promise-stream
[git-image]: https://img.shields.io/github/tag/micro-js/promise-stream.svg?style=flat-square
[git-url]: https://github.com/micro-js/promise-stream
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
[npm-image]: https://img.shields.io/npm/v/@f/promise-stream.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@f/promise-stream
