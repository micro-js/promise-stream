/**
 * Modules
 */

var foreach = require('@f/foreach')
var isPromise = require('@f/is-promise')
var mapArray = require('@f/map-array')

/**
 * Expose promiseStream
 */

module.exports = stream

stream.on = on
stream.map = map
stream.combine = combine

/**
 * Stream
 */

function stream (initial) {
  var promise
  var last
  var listeners = []

  function next (p) {
    if (p) {
      setPromise(p)
    } else {
      return promise
    }
  }

  next.subscribe = function (fn) {
    listeners.push(fn)
  }

  next.last = function () {
    return last
  }

  setPromise(initial)

  return next

  function setPromise (p) {
    if (isPromise(p)) {
      promise = p
      promise.then(handleResolve)
    } else {
      promise = Promise.resolve(p)
      handleResolve(p)
    }
  }

  function handleResolve (v) {
    last = v
    foreach(function (fn) {
      fn(last)
    }, listeners)
  }
}

function on (fn, s) {
  return s.subscribe(fn)
}

function map (fn, s) {
  return combine(fn, [s])
}

function combine (fn, deps) {
  var m = stream()

  foreach(function (dep) {
    dep.subscribe(next)
  }, deps)

  next()

  return m

  function next () {
    m(fn.apply(null, mapArray(function (dep) {
      return dep.last()
    }, deps)))
  }
}
