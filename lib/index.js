/**
 * Modules
 */

var foreach = require('@f/foreach')
var isPromise = require('@f/is-promise')
var isUndefined = require('@f/is-undefined')
var isFunction = require('@f/is-function')
var mapArray = require('@f/map-array')
var toPromise = require('@f/to-promise')
var defer = require('@f/defer-promise')
var logError = require('@f/log-error')

/**
 * Expose promiseStream
 */

module.exports = stream

stream.on = on
stream.wait = wait
stream.map = map
stream.combine = combine

/**
 * Stream
 */

function stream (initialVal, errorHandler) {
  var listeners = []
  var pending = 0
  var val
  var wait

  function next (v) {
    if (isPromise(v)) {
      pending++
      v.then(function (r) {
        next(r)
        maybeResolveWait()
      }).catch(function (err) {
        maybeResolveWait()
        errorHandler && errorHandler(err)
        throw err
      })
      return
    }

    if (!isUndefined(v)) {
      val = v
      emit()
    } else {
      return val
    }
  }

  next.subscribe = function (fn) {
    listeners.push(fn)
  }

  next.wait = function () {
    if (!pending && val) return Promise.resolve(val)
    if (!wait) {
      wait = defer()
    }
    return wait.promise
  }

  function maybeResolveWait () {
    pending--
    if (!pending && wait) {
      wait.resolve(val)
      wait = null
    }
  }

  if (isFunction(initialVal)) {
    errorHandler = initialVal
  } else if (!isUndefined(initialVal)) {
    next(initialVal)
  }

  if (!errorHandler) {
    errorHandler = logError
  }

  return next

  function emit () {
    foreach(function (fn) {
      fn(val)
    }, listeners)
  }
}

function on (fn, s) {
  return s.subscribe(fn)
}

function wait (s) {
  return s.wait()
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

  var wait = m.wait
  m.wait = function () {
    return Promise.all(mapArray(function (dep) {
      return dep.wait()
    }, deps)).then(function (vals) {
      return wait()
    })
  }

  return m

  function next () {
    var vals = new Array(deps.length)
    var dep
    for (var i = 0; i < deps.length; ++i) {
      dep = deps[i]
      if (isUndefined(dep())) {
        return
      } else {
        vals[i] = dep()
      }
    }
    m(fn.apply(null, vals))
  }
}
