'use strict'

const install = () => {
  localStorage.isPushEnabled = false
  localStorage.isNotifiable  = false
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
      navigator.serviceWorker.register('/sw.js').then(init).catch(e => {
        console.log('ServiceWorker registration failed: ', e)
      })
    }
    const button = document.querySelector('.js-push-button')
    console.log(button)
    button.addEventListener('click', () => {
      if (localStorage.isPushEnabled) {
        this.unsubscribe()
      } else {
        this.subscribe()
      }
    })
  })
}

const init = () => {
  if (!('notify' in ServiceWorkerRegistration.prototype)) {
    console.warn('Notifications aren\'t supported.')
    return
  }
  if (Notification.permission === 'denied') {
    console.warn('The user has blocked notifications.')
    return
  }
  if (!('PushManager' in window)) {
    console.warn('Push messaging isn\'t supported.')
    return
  }
  navigator.serviceWorker.ready.then(reg => {
    reg.pushManager.getSubscription().then(subscription => {
      const button    = document.querySelector('.js-push-button')
      button.disabled = false
      if (!subscription) {
        return
      }
      button.textContent         = 'Disable Push Messages'
      localStorage.isPushEnabled = true
    }).catch(e => {
      console.warn('Error during getSubscription()', e)
    })
  })
}

const subscribe = () => {
  const button    = document.querySelector('.js-push-button')
  button.disabled = true
  navigator.serviceWorker.ready.then(reg => {
    reg.pushManager.subscribe({ userVisibleOnly : true }).then(subscription => {
      localStorage.isPushEnabled = true
      button.textContent         = 'Disable Push Messages'
      button.disabled            = false
      return subscription
    }).catch(e => {
      if (Notification.permission === 'denied') {
        console.warn('Permission for Notifications was denied')
        button.disabled = true
      } else {
        console.error('Unable to subscribe to push.', e)
        button.disabled    = false
        button.textContent = 'Enable Push Messages'
      }
    })
  })
}

const unsubscribe = () => {
  const button    = document.querySelector('.js-push-button')
  button.disabled = true
  navigator.serviceWorker.ready.then(reg => {
    reg.pushManager.getSubscription().then(subscription => {
      if (!subscription) {
        localStorage.isPushEnabled = false
        button.disabled            = false
        button.textContent         = 'Enable Push Messages'
        return
      }
      subscription.unsubscribe().then(success => {
        localStorage.isPushEnabled = false
        button.disabled            = false
        button.textContent         = 'Enable Push Messages'
      }).catch(e => {
        console.error('Unsubscription error: ', e)
        button.disabled    = false
        button.textContent = 'Enable Push Messages'
      })
    }).catch(e => {
      console.error('Error thrown while unsubscribing from push messaging.', e)
    })
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
