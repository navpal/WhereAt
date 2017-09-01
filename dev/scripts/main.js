const setList = {};
setList.apiKey = 'adfa5e7c-adba-4668-a148-a7e3818447ce';
// app.ArtistBaseUrl = 'https://api.setlist.fm/rest/1.0/search/artistsName?p=1&sort=sortName';
// setList.venueBaseUrl = 'https://api.setlist.fm/rest/1.0/artist/c649f061-c881-4cdb-9812-736b4f04b4b8/setlists?p=1';

// function getFirstElement(arr) {
// 	return arr[0];
// }

String.prototype.capitalize = function() {
   return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

setList.getUserInput = () => {
	$('form').on('submit', function(e){
		e.preventDefault();
		$('.artistCardContainer').empty();
		$('.showContainer').empty();
		let artistName = $('input').val().toLowerCase().capitalize();
		// console.log(artistName);

		setList.getArtistInfo(artistName);
	});
}

setList.selectCard = () => {

	$('.artistCardContainer').on('click', '.artistCard', function(){
			let mbid = this.getAttribute('data-type');
			setList.getVenueInfo(mbid);

			// console.log(mbid);
	});
}



setList.getArtistInfo = (userArtist) => {
	$.ajax({
		url: 'http://proxy.hackeryou.com',
		dataType: 'json',
		method:'GET',
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
	}).then(function(res){
		let artist = res.artist;
		let nameArray = artist.filter((item) => {
			return item.name === userArtist
		})
		let noDis = nameArray.filter((dis) => {
			return dis.disambiguation != null
		})
		// console.log(nameArray);
		// console.log(noDis);

		for (let i = 0; i < noDis.length; i++) {
			setList.displayCards(noDis[i].name, noDis[i].disambiguation, noDis[i].mbid);
		}
	}, function(failure){
		let failureMsg = $('<h2>').addClass('failureMsg').text('No Results...Check Your Spelling!');
		$('.artistCardContainer').append(failureMsg);
	});
}

setList.displayCards = (name, desc, mbid) => {
	let artistCard = $('<div>').addClass('artistCard').attr('data-type', mbid);
	let artistCardName = $('<h3>').text(name);
	let artistCardDesc = $('<p>').text(desc);

	let bandCard = artistCard.append(artistCardName, artistCardDesc);
	$('.artistCardContainer').append(bandCard);
}
setList.getVenueInfo = (artistId) => {
	$.ajax({
		url: 'http://proxy.hackeryou.com',
		dataType: 'json',
		method:'GET',
		data: {
			reqUrl: `https://api.setlist.fm/rest/1.0/artist/${artistId}/setlists`,
			params: {
				p: '1'
			},
			proxyHeaders: {
				'x-api-key': setList.apiKey,
				Accept: 'application/json'
			},
			xmlToJSON: false
		}
	}).then(function(res){
		// console.log(res);
		$('.showContainer').empty();
		let setlists = res.setlist;
		setList.recentShows(setlists);
	}, function(failure){
		// console.log('failure');
		let failureMsg = $('<h2>').addClass('failureMsg').text('Sorry no shows');
		$('.showContainer').append(failureMsg);
	});
}

setList.recentShows = (arr) => {
	for(let i = 0; i < 6 && i < arr.length; i++){
		console.log(arr[i].sets);
		let eventDate = arr[i].eventDate;
		let eventVenue = arr[i].venue.name;
		let eventCity = arr[i].venue.city.name;
		let eventLat = arr[i].venue.city.coords.lat;
		let eventLong = arr[i].venue.city.coords.long;


		// console.log(eventSet);

		if (arr[i].sets.set.length > 0) {
			let eventSet = arr[i].sets.set[0].song;
			setList.displayShows(eventDate, eventVenue, eventCity, eventSet);
			setList.lightBox(eventSet, eventLat, eventLong);
		}


	}
}

setList.displayShows = (date, venue, city, set) => {
	// console.log(date, venue, city)
	let dateCont= $('<div>').addClass('dateContainer');
	let showDate = $('<p>').addClass('date').text(date);
	let dateContainer = dateCont.append(showDate);

	let venueName = $('<h4>').addClass('venueName').text(venue);
	let cityName = $('<h5>').addClass('cityName').text(city);
    console.log(set[0])
	let showCard = $('<div>').addClass('showCard').attr('data-featherlight', '#lightbox').attr('data-set', JSON.stringify(set)).append(dateContainer, venueName, cityName);
	$('.showContainer').append(showCard);

}


setList.lightBox = (eventSet, eventLat, eventLong) => {
	$('.showCard').on('click', function() {
		let lightBox = $('<div>').attr('id', 'lightbox');
		let setSongs = $('<ul>').addClass('setSongs');
		var sets = $(this).data('set');
			// JSON.parse(sets);
			console.log(sets)
		for (let i = 0; i < eventSet.length; i++) {
			let songName = eventSet[i].name;
		}

	});
}

setList.init = () => {
	setList.getUserInput();
	setList.selectCard();
	setList.lightBox();

}

$(function(){
	setList.init();
});