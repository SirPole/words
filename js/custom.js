$.ajaxSetup({
	cache: false //DEBUG, remove me!
});

function matchHeight() {
	$(".row:not(.noMatch)").each(function (i, e) {
		var maxHeight = -1;
		$(e).find("div[class^=col-]").each(function (j, f) {
			if ($(f).height() > maxHeight) {
				maxHeight = $(f).height();
			}
		});
		$(e).find("div[class^=col-]").height(maxHeight);
	});
}
function scrollWin(el, time, editPos) {
	if (el.length) {
		var time = time ? time : 500,
			finalPos = $(el).offset().top;
		if (editPos) finalPos += editPos;

		$('body, html').animate({
			scrollTop: finalPos
		}, time);
	}
}

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

function showNotification(title, isNotifiable) {
	if(isNotifiable) {
		if(navigator.userAgent.indexOf('Android') >= 0) {
			navigator.serviceWorker.register('');
			navigator.serviceWorker.ready.then(function(registration) {
				registration.showNotification('Notification with ServiceWorker');
			});
		} else {
			new Notification(title);
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
	if(!window.updates) {
		window.updates = window.setInterval(update, 5000);
	}
}
update();

function loadData(response) {
	$('.alert').remove();
	if ($('#words').html() != response.data) {
		showNotification('Nové slovo!', isNotifiable);
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