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
    const icon = 'app192.png'
    const tag  = 'tag'
    if (navigator.userAgent.indexOf('Android') >= 0) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(title, {
          body : body,
          icon : icon,
          tag  : tag
        })
      })
    } else {
      new Notification(title, {
        body : body,
        icon : icon,
        tag  : tag
      })
    }
  }
}

export {
  install,
  notify
}
