'use strict';

this.addEventListener("activate", function (event) {
	if (clients.claim)
		event.waitUntil(clients.claim());
});

self.addEventListener('push', function (event) {
	event.waitUntil(
		fetch('ajax/action.php').then(function (response) {
			if (response.status !== 200) {
				console.log('Looks like there was a problem. Status Code: ' + response.status);
				throw new Error();
			}

			// Examine the text in the response
			return response.json().then(function (data) {
				console.log(data);
				if (!data.lastWord) {
					console.error('The API returned an error.', data.error);
					throw new Error();
				}

				var title = 'Words';
				var message = data.lastWord;
				var icon = 'app192.png';
				var notificationTag = 'tag';

				return self.registration.showNotification(title, {
					body: message,
					icon: icon,
					tag: notificationTag
				});
			});
		}).catch(function (err) {
			console.error('Unable to retrieve data', err);
		})
	);
});


self.addEventListener('notificationclick', function (event) {
	event.waitUntil(handleNotificationClick(event));
});


function handleNotificationClick(event) {
	event.notification.close();
	if (!clients.matchAll) // HACK for Chrome versions pre crbug.com/451334
		clients.matchAll = clients.getAll;
	// Enumerate windows, and call window.focus(), or open a new one.
	return clients.matchAll({
		type: "window",
		includeUncontrolled: true
	}).catch(function (ex) {
		// Chrome doesn't yet support includeUncontrolled:true crbug.com/455241
		if (ex.name != "NotSupportedError")
			throw ex;
		return clients.matchAll({
			type: "window",
			includeUncontrolled: false
		});
	}).then(function (clientList) {
		for (var i = 0; i < clientList.length; i++) {
			var client = clientList[i];
			// TODO: Intelligently choose which client to focus.
			if (client.focus)
				return client.focus();
		}
		if (clients.openWindow)
			return clients.openWindow("/chat/");
	});
}