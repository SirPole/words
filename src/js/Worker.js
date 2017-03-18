'use strict'

const install = () => {
  localStorage.isNotifiable = false
  if (window.Notification) {
    if (window.Notification.permission == 'granted') {
      localStorage.isNotifiable = true;
    } else {
      window.Notification.requestPermission(() => {
        if (window.Notification.permission == 'granted') {
          localStorage.isNotifiable = true;
        }
      })
    }
  }
  window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(e => {
        console.error('ServiceWorker registration failed: ', e)
      })
    }
  })
}

const notify = (title, body) => {
  if (localStorage.isNotifiable) {
    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification(title, {
        body : body,
        icon : 'app192.png',
        tag  : 'tag'
      })
    })
  }
}

export {
  install,
  notify
}
