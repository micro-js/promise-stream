/**
 * Imports
 */

var stream = require('..')
var test = require('tape')

/**
 * Tests
 */

 test('should get current last', function (t) {
   t.plan(1)
   var s = stream()
   s(1)
   t.equal(s(), 1)
 })

 test('should subscribe to changes', function (t) {
   t.plan(2)
   var s = stream()
   var count = 0
   s.subscribe(function (val) {
     t.equal(val, ++count)
   })
   s(1)
   setTimeout(function () {
     s(2)
   }, 50)
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

   s(1)
   setTimeout(function () {
     s(2)
   }, 50)
 })

 test('should combine streams', function (t) {
   t.plan(3)

   var in1 = stream(1)
   var in2 = stream(1)
   var add = stream.combine(function (arg1, arg2) {
     return arg1 + arg2
   }, [in1, in2])

   t.equal(add(), 2)

   in1(2)
   t.equal(add(), 3)
   in2(2)
   t.equal(add(), 4)
 })

 test('should wait for promises', function (t) {
   t.plan(1)
   var s = stream()
   s(Promise.resolve(1))
   equal(t, s.wait(), 1)
 })

 test('should wait for ongoing calc', function (t) {
   t.plan(1)
   var s = stream()
   s(delay(50, 1))
   equal(t, s.wait(), 1)
 })

 test('should wait for ongoing calcs', function (t) {
   t.plan(1)
   var s = stream()
   s(delay(50, 1))
   s(delay(150, 2))
   equal(t, s.wait(), 2)
 })

test('should map wait', function (t) {
  t.plan(2)
  var s = stream()
  var s2 = stream.map(function (val) {
    return val + 1
  }, s)

  s(delay(50, 1))
  equal(t, s2.wait(), 2)
  setTimeout(function () {
    s(delay(50, 2))
    equal(t, s2.wait(), 3)
  }, 100)
})

test('should wait for combined streams', function (t) {
  t.plan(2)

  var in1 = stream(1)
  var in2 = stream(1)
  var add = stream.combine(function (arg1, arg2) {
    return arg1 + arg2
  }, [in1, in2])

  t.equal(add(), 2)

  in1(delay(50, 2))

  equal(t, add.wait(), 3)
})

function equal(t, s, val) {
  s.then(function (v) {
    t.equal(v, val)
  })
}

function delay (d, last) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(last)
    }, d)
  })
}
