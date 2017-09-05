'use strict';

var setList = {};
setList.apiKey = 'adfa5e7c-adba-4668-a148-a7e3818447ce';

setList.smoothScroll = function () {
	$('.arrowContainer').click(function (e) {
		$('html, body').animate({
			scrollTop: $('#searchBar').offset().top
		}, 1500);
	});
	String.prototype.capitalize = function () {
		return this.replace(/(?:^|\s)\S/g, function (a) {
			return a.toUpperCase();
		});
	};
};

setList.getUserInput = function () {
	$('form').on('submit', function (e) {
		$('html, body').animate({
			scrollTop: $("#listOfShows").offset().top
		}, 1500);
		e.preventDefault();
		$('.artistCardContainer').empty();
		$('.showContainer').empty();
		var artistName = $('input').val().toLowerCase().capitalize();

		setList.getArtistInfo(artistName);
	});
};

setList.selectCard = function () {

	$('.artistCardContainer').on('click', '.artistCard', function () {
		$('html, body').animate({
			scrollTop: $("#listOfShows").offset().top
		}, 1500);
		var mbid = this.getAttribute('data-type');
		setList.getVenueInfo(mbid);
	});
};

setList.getArtistInfo = function (userArtist) {
	$.ajax({
		url: 'http://proxy.hackeryou.com',
		dataType: 'json',
		method: 'GET',
		data: {
			reqUrl: 'https://api.setlist.fm/rest/1.0/search/artists',
			params: {
				artistName: userArtist,
				p: '1',
				sort: 'sortName'
			},
			proxyHeaders: {
				'x-api-key': setList.apiKey,
				Accept: 'application/json'
			},
			xmlToJSON: false
		}
	}).then(function (res) {
		var artist = res.artist;
		var nameArray = artist.filter(function (item) {
			return item.name === userArtist;
		});
		var noDis = nameArray.filter(function (dis) {
			return dis.disambiguation != null;
		});

		for (var i = 0; i < noDis.length; i++) {
			setList.displayCards(noDis[i].name, noDis[i].disambiguation, noDis[i].mbid);
		}
	}, function (failure) {
		var failureMsg = $('<h2>').addClass('failureMsg').text('No Results...Check Your Spelling!');
		$('.artistCardContainer').append(failureMsg);
	});
};

setList.displayCards = function (name, desc, mbid) {
	var artistCard = $('<div>').addClass('artistCard').attr('data-type', mbid);
	var artistCardName = $('<h3>').text(name);
	var artistCardDesc = $('<p>').text(desc);

	var bandCard = artistCard.append(artistCardName, artistCardDesc);
	$('.artistCardContainer').append(bandCard);
};

setList.getVenueInfo = function (artistId) {
	$.ajax({
		url: 'http://proxy.hackeryou.com',
		dataType: 'json',
		method: 'GET',
		data: {
			reqUrl: 'https://api.setlist.fm/rest/1.0/artist/' + artistId + '/setlists',
			params: {
				p: '1'
			},
			proxyHeaders: {
				'x-api-key': setList.apiKey,
				Accept: 'application/json'
			},
			xmlToJSON: false
		}
	}).then(function (res) {
		$('.showContainer').empty();
		var setlists = res.setlist;
		if (setlists.length > 1) {
			setList.recentShows(setlists);
		} else if (setlists.length == 1) {
			setList.failMsg();
		}
	}, function (failure) {
		setList.failMsg();
	});
};

setList.failMsg = function () {
	var failureMsg = $('<h2>').addClass('failureMsg').text('Sorry no shows');
	$('.showContainer').empty();
	$('.showContainer').append(failureMsg);
};

setList.recentShows = function (arr) {
	for (var i = 0; i < 6 && i < arr.length; i++) {
		console.log(arr[i].sets);
		var eventDate = arr[i].eventDate;
		var eventVenue = arr[i].venue.name;
		var eventCity = arr[i].venue.city.name;
		var eventLat = arr[i].venue.city.coords.lat;
		var eventLong = arr[i].venue.city.coords.long;

		if (arr[i].sets.set.length > 0) {
			var eventSet = arr[i].sets.set[0].song;
			setList.displayShows(eventDate, eventVenue, eventCity, eventSet, eventLat, eventLong);
		}
	}
};

setList.displayShows = function (date, venue, city, set, lat, long) {
	// console.log(date, venue, city)
	var dateCont = $('<div>').addClass('dateContainer');
	var showDate = $('<p>').addClass('date').text(date);
	var dateContainer = dateCont.append(showDate);

	var venueName = $('<h4>').addClass('venueName').text(venue);
	var cityName = $('<h5>').addClass('cityName').text(city);
	console.log(set[0]);
	var showCard = $('<div>').addClass('showCard').attr('data-set', JSON.stringify(set)).attr('data-lat', lat).attr('data-long', long).append(dateContainer, venueName, cityName);
	$('.showContainer').append(showCard);
};

setList.events = function () {
	$('.showContainer').on('click', '.showCard', function () {
		var sets = $(this).data('set');
		var lat = $(this).data('lat');
		var long = $(this).data('long');
		var songArr = [];

		for (var i = 0; i < sets.length; i++) {
			var songName = sets[i].name;
			songArr.push(songName);
			console.log(songArr, lat, long);
		}
		console.log('events');
		setList.lightBox(songArr, function () {
			setList.initMap(lat, long);
		});
	});
};

setList.initMap = function (lat, long) {
	var venue = { lat: lat, lng: long };
	var map = new google.maps.Map(document.getElementById('mapContainer'), {
		zoom: 10,
		center: venue
	});
	var marker = new google.maps.Marker({
		position: venue,
		map: map
	});
};

setList.lightBox = function (songArr, callback) {
	console.log(songArr);
	var lightBox = $('<div>').addClass('lightbox');
	var setSongs = $('<ul>').addClass('setSongs');
	//make container for map
	var mapContainer = $('<div>').attr('id', 'mapContainer');
	//append to lightbox

	for (var i = 0; i < songArr.length; i++) {
		var songItem = $('<li>').addClass('songItem').text(songArr[i]);
		setSongs.append(songItem);
		// $('#lightbox').append(setSongs);
	}
	$(lightBox).append(setSongs, mapContainer);
	$.featherlight(lightBox, {
		afterOpen: callback
	});
};

setList.init = function () {
	setList.getUserInput();
	setList.selectCard();
	setList.events();
	setList.smoothScroll();
};

$(function () {
	setList.init();
});