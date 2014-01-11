angular.module('techNodeApp').factory('data', function($q, socket, cache) {

  function randomString(length) {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

      if (!length) {
          length = Math.floor(Math.random() * chars.length);
      }

      var str = '';
      for (var i = 0; i < length; i++) {
          str += chars[Math.floor(Math.random() * chars.length)];
      }
      return str;
  }

  function getRequestId() {
    return randomString(16) + '.' + Date.now()
  }

  function request(data, callback) {
    console.info('socket.request:', JSON.stringify(data))
    if(data.method === 'get') {
      socket.once('technode.' + data.requestId, function (data) {
        console.info('socket.response:', JSON.stringify(data))
        callback(data.data)
      })
    }
    socket.emit('technode', data)
  }

  socket.on('technode', function (data) {
    if (data.method === 'post' && cache[data.model]) {
      cache[data.model].push(data.data)
    } else if (data.method === 'put' && cache[data._id]) {
      cache[_id] = angular.extend(cache[_id], data.data)
    } else if (data.method === 'delete' && cache[data.model]) {
      cache[data.model] = cache[data.model].filter(function (model) {
        return model._id !== data._id
      })
    }
  })

  return {
    // get('users', '543u8ug98eru34t8435ureg', {})
    // get('users', {})
    get: function (model, _id, data) {
      var deferred = $q.defer()
      if (typeof data === 'undefined' && typeof _id !== 'string') {
        data = _id
        _id = null
      }
      if (_id && cache[_id]) {
        deferred.resolve(cache[_id])
      } else if (cache[model]) {
        deferred.resolve(cache[model])
      } else {
        request({
          model: model,
          _id: _id,
          method: 'get',
          requestId: getRequestId(),
          data: data
        }, function (data) {
          if (_id) {
            cache[_id] = data
            deferred.resolve(cache[_id])
          } else {
            cache[model] = data
            deferred.resolve(cache[model])
          }
        })
      }
      return deferred.promise;
    },
    post: function (model, data) {
      request({
        model: model,
        method: 'post',
        data: data
      })
    },
    put: function (model, _id, data) {
      request({
        model: model,
        _id: _id,
        method: 'put',
        data: data
      })
    },
    remove: function (model, _id, data) {
      request({
        model: model,
        _id: _id,
        method: 'delete',
        data: data
      })
    }
  }
})