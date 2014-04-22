module.exports = function forward (methods, cacheReceiver, getReceiver) {
  if (typeof cacheReceiver === 'function') {
    getReceiver = cacheReceiver
    cacheReceiver = false
  }

  var receiver = null

  return methods.reduce(forwardMethod, {})

  function forwardMethod (proxy, method) {
    proxy[method] = function () {
      var args = Array.prototype.slice.call(arguments)
      var last = args[args.length - 1]
      var handleError = typeof last === 'function' ? last : throwIt

      if (cacheReceiver && receiver) {
        try {
          receiver[method].apply(receiver, args)
        } catch (err) {
          handleError(err)
        }
        return
      }

      try {
        getReceiver(invokeMethod)
      } catch (err) {
        handleError(err)
      }

      function invokeMethod (err, receiver) {
        if (err) {
          handleError(err)
          return
        }
        try {
          receiver[method].apply(receiver, args)
        } catch (err) {
          handleError(err)
        }
      }
    }

    return proxy
  }
}

function throwIt (err) {
  // if the last argument is not a function, errors will be re-thrown
  throw err
}
