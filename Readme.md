
# promise-stream

[![Build status][travis-image]][travis-url]
[![Git tag][git-image]][git-url]
[![NPM version][npm-image]][npm-url]
[![Code style][standard-image]][standard-url]

A stream of promises. Good for representing a value that can be recomputed. API inspired by [flyd](//github.com/paldepind/flyd).

Note: The most recent promise added to stream `s` is returned with `s()`. This can lead to strange behavior when multiple promises are added before they are resolved. 

## Installation

    $ npm install @f/promise-stream

## Usage

```js
import stream from '@f/promise-stream'

var s = stream(delay(10, 1))

co(function * () {
  yield s() // 1
  yield s() // 1
  s(delay(10, 2))
  yield s() // 2
})

var in1 = stream(1)
var in2 = stream(1)

var add = stream.combine(function (arg1, arg2) {
  return arg1 + arg2
}, [in1, in2])

co(function * () {
  yield add() // 2
  yield add() // 2
  in1(dely(10, 2))
  yield add() // 3
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

**Returns:** function for pushing promises on to the stream or retreiving the most recent promise

### stream.on(fn, s)

- `fn` - listen for resolved promises in stream `s`
- `s` - stream instance

### stream.map(fn, s)

- `fn` - mapping function on resolved values in stream `s`
- `s` - stream instance

**Returns:** a new stream

### stream.combine(fn, deps)

- `fn` - mapping function over resolved values in streams `deps`
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
