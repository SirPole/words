$.ajaxSetup({
	cache: false //DEBUG, remove me!
});

var quotes = [
	//Tyson
	"The good thing about science is that it's true whether or not you believe in it.",
	"For me, I am driven by two main philosophies: know more today about the world than I knew yesterday and lessen the suffering of others. You'd be surprised how far that gets you.",
	"We spend the first year of a child's life teaching it to walk and talk and the rest of its life to shut up and sit down. There's something wrong there.",
	"... there is no shame in not knowing. The problem arises when irrational thought and attendant behavior fill the vacuum left by ignorance.",
	"The most astounding fact... is the knowledge that the atoms that comprise life on Earth, the atoms that make up the human body, are traceable to the crucibles that cooked light elements into heavy elements in their core under extreme temperatures and pressures. These stars, the high mass ones among them, went unstable in their later years. They collapsed and then exploded, scattering their enriched guts across the galaxy. Guts made of carbon, nitrogen, oxygen and all the fundamental ingredients of life itself. These ingredients become part of gas clouds that condense, collapse, form the next generation of solar systems, stars with orbiting planets. And those planets now have the ingredients for life itself. So that when I look up at the night sky and I know that yes, we are part of this universe, we are in this universe, but perhaps more important than both of those facts is that the universe is in us. When I reflect on that fact, I look up—many people feel small because they’re small and the universe is big—but I feel big, because my atoms came from those stars. There’s a level of connectivity. That’s really what you want in life, you want to feel connected, you want to feel relevant, you want to feel like you’re a participant in the goings-on of activities and events around you. That’s precisely what we are, just by being alive.",
	//Feynman
	"Nobody ever figures out what life is all about, and it doesn't matter. Explore the world. Nearly everything is really interesting if you go into it deeply enough.",
	"You have no responsibility to live up to what other people think you ought to accomplish. I have no responsibility to be like they expect me to be. It's their mistake, not my failing.",
	"The highest forms of understanding we can achieve are laughter and human compassion.",
	"Physics isn't the most important thing. Love is.",
	"I think it's much more interesting to live not knowing than to have answers which might be wrong.",
	"I gotta stop somewhere... and leave you something to imagine.",
	//Cox
	"The problem with today’s world is that everyone believes they have the right to express their opinion AND have others listen to it. The correct statement of individual rights is that everyone has the right to an opinion, but crucially, that opinion can be roundly ignored and even made fun of, particularly if it is demonstrably nonsense!",
	"We are the cosmos made conscious and life is the means by which the universe understands itself.",
	"You dig deeper and it gets more and more complicated, and you get confused, and it's tricky and it's hard, but... It is beautiful.",
	//Nye
	"Everyone you will ever meet knows something you don't.",
	"The more you find out about the world, the more opportunities there are to laugh at it.",
	"To leave the world better than you found it, sometimes you have to pick up other people’s trash.",
	"Science is the key to our future, and if you don’t believe in science, then you’re holding everybody back.",
	"The Earth is not 6,000 or 10,000 years old. It's not. And if that conflicts with your beliefs, I strongly feel you should question your beliefs.",
	//Sagan
	"Somewhere, something incredible is waiting to be known.",
	"Every one of us is, in the cosmic perspective, precious. If a human disagrees with you, let him live. In a hundred billion galaxies, you will not find another.",
	"If you wish to make an apple pie from scratch, you must first invent the universe."
];

$('#quote').html(quotes[Math.floor(Math.random() * (quotes.length - 1))]);

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function notify(title, body, isNotifiable) {
	if (isNotifiable) {
		var icon = 'app192.png';
		var tag = 'tag';
		if (navigator.userAgent.indexOf('Android') >= 0) {
			navigator.serviceWorker.ready.then(function (reg) {
				reg.showNotification(title, {
					body: body,
					icon: icon,
					tag: tag
				});
			});
		} else {
			new Notification(title, {
				body: body,
				icon: icon,
				tag: tag
			});
		}
	}
}

$('form button').click(function () {
	$(this).parents('form').find('#action').val($(this).attr('id'));
});

$('form').submit(function (e) {
	e.preventDefault();
	console.log($(this).serialize());
	$.ajax({
		type: 'POST',
		data: $(this).serialize(),
		url: '../ajax/action.php'
	}).done(function (response) {
		loadData(JSON.parse(response));
	});
});

function update() {
	$.ajax({
		url: '../ajax/action.php'
	}).done(function (response) {
		loadData(JSON.parse(response));
	});
	if (!window.updates) {
		window.updates = window.setInterval(update, 5000);
	}
}

function loadData(response) {
	$('.alert').remove();
	if ($('#words').html() != response.data) {
		if ($('#words').html() != '') {
			notify('Nové slovo!', response.lastWord, isNotifiable);
		}
		$('#words').html(response.data);
		$('#lastChar').html(response.lastChar);
	}
	if (response.err === false) {
		$('form').parent().append('<div class="alert alert-success" role="alert">Ok, slovo lze použít</div>');
	} else if (response.err == true) {
		$('#lastChar').addClass('invalid');
	} else if (response.err) {
		$('#' + response.err).addClass('invalid');
	}
	$('#author').val($('#author option[value=' + $('#words .word').last().attr('title') + ']').siblings('option').val()).change();
}

var guid1 = guid();
$(window).on('load', function () {
	$('#guid').val(guid1);
	update();
});

'use strict';

var isNotifiable = false;
if (window.Notification) {
	if (window.Notification.permission == "granted") {
		isNotifiable = true;
	} else {
		window.Notification.requestPermission(function () {
			if (window.Notification.permission == "granted") {
				isNotifiable = true;
			}
		});
	}
}

var API_KEY = "AIzaSyA9ZT8fiaMtd2SvSnYlsilFGfLCnbxU3PM";
var isPushEnabled = false;

function subscribe() {
	// Disable the button so it can't be changed while
	// we process the permission request
	var pushButton = document.querySelector('.js-push-button');
	pushButton.disabled = true;

	navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
		serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
			.then(function (subscription) {
				// The subscription was successful
				isPushEnabled = true;
				pushButton.textContent = 'Disable Push Messages';
				pushButton.disabled = false;

				// TODO: Send the subscription.endpoint to your server
				// and save it to send a push message at a later date
				return sendSubscriptionToServer(subscription);
			})
			.catch(function (e) {
				if (Notification.permission === 'denied') {
					// The user denied the notification permission which
					// means we failed to subscribe and the user will need
					// to manually change the notification permission to
					// subscribe to push messages
					console.warn('Permission for Notifications was denied');
					pushButton.disabled = true;
				} else {
					// A problem occurred with the subscription; common reasons
					// include network errors, and lacking gcm_sender_id and/or
					// gcm_user_visible_only in the manifest.
					console.error('Unable to subscribe to push.', e);
					pushButton.disabled = false;
					pushButton.textContent = 'Enable Push Messages';
				}
			});
	});
}

function unsubscribe() {
	var pushButton = document.querySelector('.js-push-button');
	pushButton.disabled = true;

	navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
		// To unsubscribe from push messaging, you need get the
		// subscription object, which you can call unsubscribe() on.
		serviceWorkerRegistration.pushManager.getSubscription().then(
			function (pushSubscription) {
				// Check we have a subscription to unsubscribe
				if (!pushSubscription) {
					// No subscription object, so set the state
					// to allow the user to subscribe to push
					isPushEnabled = false;
					pushButton.disabled = false;
					pushButton.textContent = 'Enable Push Messages';
					return;
				}

				var subscriptionId = pushSubscription.subscriptionId;
				// TODO: Make a request to your server to remove
				// the subscriptionId from your data store so you
				// don't attempt to send them push messages anymore

				// We have a subscription, so call unsubscribe on it
				pushSubscription.unsubscribe().then(function (successful) {
					pushButton.disabled = false;
					pushButton.textContent = 'Enable Push Messages';
					isPushEnabled = false;
				}).catch(function (e) {
					// We failed to unsubscribe, this can lead to
					// an unusual state, so may be best to remove
					// the users data from your data store and
					// inform the user that you have done so

					console.log('Unsubscription error: ', e);
					pushButton.disabled = false;
					pushButton.textContent = 'Enable Push Messages';
				});
			}).catch(function (e) {
			console.error('Error thrown while unsubscribing from push messaging.', e);
		});
	});
}

// Once the service worker is registered set the initial state
function initialiseState() {
	// Are Notifications supported in the service worker?
	if (!('notify' in ServiceWorkerRegistration.prototype)) {
		console.warn('Notifications aren\'t supported.');
		return;
	}

	// Check the current Notification permission.
	// If its denied, it's a permanent block until the
	// user changes the permission
	if (Notification.permission === 'denied') {
		console.warn('The user has blocked notifications.');
		return;
	}

	// Check if push messaging is supported
	if (!('PushManager' in window)) {
		console.warn('Push messaging isn\'t supported.');
		return;
	}

	// We need the service worker registration to check for a subscription
	navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
		// Do we already have a push message subscription?
		serviceWorkerRegistration.pushManager.getSubscription()
			.then(function (subscription) {
				// Enable any UI which subscribes / unsubscribes from
				// push messages.
				var pushButton = document.querySelector('.js-push-button');
				pushButton.disabled = false;

				if (!subscription) {
					// We aren't subscribed to push, so set UI
					// to allow the user to enable push
					return;
				}

				// Keep your server in sync with the latest subscriptionId
				sendSubscriptionToServer(subscription);

				// Set your UI to show they have subscribed for
				// push messages
				pushButton.textContent = 'Disable Push Messages';
				isPushEnabled = true;
			})
			.catch(function (err) {
				console.warn('Error during getSubscription()', err);
			});
	});
}

window.addEventListener('load', function () {
	var pushButton = document.querySelector('.js-push-button');
	pushButton.addEventListener('click', function () {
		if (isPushEnabled) {
			unsubscribe();
		} else {
			subscribe();
		}
	});

	// Check that service workers are supported, if so, progressively
	// enhance and add push messaging support, otherwise continue without it.
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/sw.js')
			.then(initialiseState);
	} else {
		console.log('Service workers aren\'t supported in this browser.');
	}
});