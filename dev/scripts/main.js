const setList = {};
setList.apiKey = 'adfa5e7c-adba-4668-a148-a7e3818447ce';

String.prototype.capitalize = function() {
   return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

setList.getUserInput = () => {
	$('form').on('submit', function(e){
		e.preventDefault();
		$('.artistCardContainer').empty();
		$('.showContainer').empty();
		let artistName = $('input').val().toLowerCase().capitalize();
		setList.getArtistInfo(artistName);
	});
}

setList.selectCard = () => {
	$('.artistCardContainer').on('click', '.artistCard', function(){
			let mbid = this.getAttribute('data-type');
			setList.getVenueInfo(mbid);
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
		$('.showContainer').empty();
			let setlists = res.setlist;
		if(setlists.length > 1){
			setList.recentShows(setlists);
		}
		else if(setlists.length == 1){
			setList.failMsg();
		}
	}, function(failure){
		setList.failMsg();
	});
}

setList.failMsg = () => {
	let failureMsg = $('<h2>').addClass('failureMsg').text('Sorry no shows');
	$('.showContainer').empty();
	$('.showContainer').append(failureMsg);
}

setList.recentShows = (arr) => {
	for(let i = 0; i < 6 && i < arr.length; i++){
		let eventDate = arr[i].eventDate;
		let eventVenue = arr[i].venue.name;
		let eventCity = arr[i].venue.city.name;
		let eventLat = arr[i].venue.city.coords.lat;
		let eventLong = arr[i].venue.city.coords.long;
		if (arr[i].sets.set.length > 0) {
			let eventSet = arr[i].sets.set[0].song;
			setList.displayShows(eventDate, eventVenue, eventCity, eventSet, eventLat, eventLong);

		}


	}
}

setList.displayShows = (date, venue, city, set, lat, long) => {
	let dateCont= $('<div>').addClass('dateContainer');
	let showDate = $('<p>').addClass('date').text(date);
	let dateContainer = dateCont.append(showDate);
	let venueName = $('<h4>').addClass('venueName').text(venue);
	let cityName = $('<h5>').addClass('cityName').text(city);
	let showCard = $('<div>').addClass('showCard').attr('data-set', JSON.stringify(set)).attr('data-lat', lat).attr('data-long', long).append(dateContainer, venueName, cityName);
	$('.showContainer').append(showCard);

}

setList.events = () => {
	$('.showContainer').on('click', '.showCard', function() {
		var sets = $(this).data('set');
		var lat = $(this).data('lat');
		var long = $(this).data('long')
		let songArr = [];

		for (let i = 0; i < sets.length; i++) {
			let songName = sets[i].name;
			songArr.push(songName);

		}
		setList.lightBox(songArr, function(){
			setList.initMap(lat, long)
		});
	});
}

setList.initMap = (lat, long) => {
    let venue = {lat: lat, lng: long};
    let map = new google.maps.Map(document.getElementById('mapContainer'), {
      zoom: 10,
      center: venue
    });
    let marker = new google.maps.Marker({
      position: venue,
      map: map
    });
}

setList.lightBox = (songArr, callback) => {
	let lightBox = $('<div>').addClass('lightbox');
	let setSongs = $('<ul>').addClass('setSongs');
	let mapContainer = $('<div>').attr('id', 'mapContainer');

	for (let i = 0; i < songArr.length; i++ ) {
		let songItem = $('<li>').addClass('songItem').text(songArr[i]);
		setSongs.append(songItem);
	}
	$(lightBox).append(setSongs, mapContainer);
	$.featherlight(lightBox, {
		afterOpen: callback
	});
}


setList.init = () => {
	setList.getUserInput();
	setList.selectCard();
	setList.events();
}

$(function(){
	setList.init();
});