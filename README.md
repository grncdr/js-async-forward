# async-forward

Forward methods to asynchronously acquired objects.

## Examples

Specify the method names you want to forward, and provide a callback for
getting the object that should receive forwarded method calls.

```javascript
var assert = require('assert')
var forward = require('./')

var methods = ['doSomethingAsync']
var proxy = forward(['double'], getSlowDoubler)

proxy.double(4, function (err, result) {
  assert.equal(8, result)
  console.log('ok - async method works')
})
```

The `getSlowDoubler` function looks like this, but it could be any sort of
async function, as long as it returns an object with the expected methods:

```javascript
function getSlowDoubler (callback) {
  var service = {
    double: function (n, callback) {
      setTimeout(function () {
        callback(null, n * 2)
      }, 100)
    }
  }

  // return the service asynchronously via callback
  process.nextTick(function () {
    callback(null, service)
  })
}
```

Any errors that occur while getting the method receiver will be forwarded to the
callback:

```javascript
function throwsAnError (callback) {
  throw new Error('whoops')
}

var proxy = forward(['myMethod'], throwsAnError)

proxy.myMethod(function (err) {
  assert.equal('whoops', err.message)
  console.log('ok - got expected error')
})
```

The same behaviour will work for errors that are returned via callback or thrown
when invoking the method.

## License

MIT
