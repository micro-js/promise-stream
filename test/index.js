/**
 * Imports
 */

var stream = require('..')
var test = require('tape')

/**
 * Tests
 */

test('should get set and get promise', function (t) {
  var s = stream()
  s(Promise.resolve(1))
  s().then(function (last) {
    t.equal(last, 1)
    t.end()
  })
})

test('should get current last', function (t) {
  var s = stream()
  s(1)
  t.equal(s.last(), 1)
  t.end()
})

test('should push promises to stream', function (t) {
  t.plan(2)

  var s = stream()
  s(1)
  setTimeout(function () {
    s(2)
  }, 50)
  t.equal(s.last(), 1)
  setTimeout(function () {
    t.equal(s.last(), 2)
  }, 100)
})

test('should wait for ongoing calc', function (t) {
  t.plan(2)
  var s = stream()
  s(delay(50, 1))
  t.equal(s.last(), undefined)
  s().then(function (last) {
    t.equal(last, 1)
  })
})

test('should subscribe to changes', function (t) {
  t.plan(2)
  var s = stream()
  var count = 0
  s.subscribe(function (val) {
    t.equal(val, ++count)
  })
  s(delay(25, 1))
  s(delay(50, 2))
})

test('should map', function (t) {
  t.plan(2)
  var s = stream()
  var s2 = stream.map(function (val) {
    return val + 1
  }, s)

  var count = 1
  s2.subscribe(function (val) {
    t.equal(val, ++count)
  })

  s(delay(25, 1))
  s(delay(50, 2))
})

test('should combine streams', function (t) {
  t.plan(3)

  var in1 = stream(1)
  var in2 = stream(1)
  var add = stream.combine(function (arg1, arg2) {
    return arg1 + arg2
  }, [in1, in2])

  t.equal(add.last(), 2)
  var count = 2
  add.subscribe(function (val) {
    t.equal(val, ++count)
  })

  in1(delay(25, 2))
  in2(delay(50, 2))
})

function delay (d, last) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(last)
    }, d)
  })
}
