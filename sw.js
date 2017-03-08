'use strict'

var __CACHENAME__ = 'Words-v1.1.0'

this.addEventListener('activate', function (event) {
  if (clients.claim) {
    event.waitUntil(clients.claim())
  }
  var cacheWhitelist = [
    __CACHENAME__
  ]
  event.waitUntil(caches.keys().then(function (cacheNames) {
    return Promise.all(cacheNames.map(function (cacheName) {
      if (cacheWhitelist.indexOf(cacheName) === -1) {
        return caches.delete(cacheName)
      }
    }))
  }))
})

this.addEventListener('install', function (event) {
  event.waitUntil(caches.open(__CACHENAME__).then(function (cache) {
    cache.addAll([
      '/',
      '/auth',
      '/build/assets/css/bundle.css',
      '/build/assets/fonts/woff2.css',
      '/src/js/jquery.min.js',
      '/src/js/tether.min.js',
      '/src/js/bootstrap.min.js',
      '/build/bundle.js',
      '/favicon.png',
      '/app192.png',
      '/index.html',
      '/manifest.json'
    ])
  }))
})

this.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request).then(function (response) {
    if (response) {
      return response
    }
    var fetchRequest = event.request.clone()
    return fetch(fetchRequest).then(function (response) {
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response
      }
      var responseToCache = response.clone()
      caches.open(__CACHENAME__).then(function (cache) {
        if (event.request.method !== 'HEAD') {
          cache.put(event.request, responseToCache)
        }
      })
      return response
    })
  }))
})

this.addEventListener('notificationclick', function (event) {
  event.waitUntil(handleNotificationClick(event))
})

function handleNotificationClick (event) {
  event.notification.close()
  if (!clients.matchAll) {
    clients.matchAll = clients.getAll
  }
  return clients.matchAll({
    type                : 'window',
    includeUncontrolled : true
  }).catch(function (ex) {
    if (ex.name !== 'NotSupportedError') {
      throw ex
    }
    return clients.matchAll({
      type                : 'window',
      includeUncontrolled : false
    })
  }).then(function (clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[ i ]
      // TODO: Intelligently choose which client to focus.
      if (client.focus) {
        return client.focus()
      }
    }
    if (clients.openWindow) {
      return clients.openWindow('/')
    }
  })
}
