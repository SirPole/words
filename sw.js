'use strict'

this.addEventListener('activate', function (event) {
  if (clients.claim) {
    event.waitUntil(clients.claim())
  }
  var cacheWhitelist = [
    'Words-v1'
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
  event.waitUntil(
    caches.open('Words-v1').then(function (cache) {
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
        '/app144.png',
        '/app96.png',
        '/app48.png',
        '/index.html',
        '/manifest.json'
      ])
    })
  )
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
      caches.open('Words-v1').then(function (cache) {
        if (event.request.method !== 'HEAD') {
          cache.put(event.request, responseToCache)
        }
      })
      return response
    })
  }))
})

this.addEventListener('push', function (event) {
  event.waitUntil(
    fetch('https://api.brychta.name?what=last').then(function (response) {
      if (response.status !== 200) {
        console.error('Looks like there was a problem. Status Code: ' + response.status)
        throw new Error()
      }
      return response.json().then(function (data) {
        if (!data.lastWord) {
          console.error('The API returned an error.', data.error)
          throw new Error()
        }
        return self.registration.showNotification('Words', {
          body : data.lastWord,
          icon : 'app192.png',
          tag  : 'tag'
        })
      })
    }).catch(function (err) {
      console.error('Unable to retrieve data', err)
    })
  )
})

this.addEventListener('notificationclick', function (event) {
  event.waitUntil(handleNotificationClick(event))
})

function handleNotificationClick (event) {
  event.notification.close()
  if (!clients.matchAll) {
    clients.matchAll = clients.getAll
  }
  // Enumerate windows, and call window.focus(), or open a new one.
  return clients.matchAll({
    type                : 'window',
    includeUncontrolled : true
  }).catch(function (ex) {
    // Chrome doesn't yet support includeUncontrolled:true crbug.com/455241
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
