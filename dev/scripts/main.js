const setList = {};
setList.apiKey = 'adfa5e7c-adba-4668-a148-a7e3818447ce';
// app.ArtistBaseUrl = 'https://api.setlist.fm/rest/1.0/search/artistsName?p=1&sort=sortName';
// setList.venueBaseUrl = 'https://api.setlist.fm/rest/1.0/artist/c649f061-c881-4cdb-9812-736b4f04b4b8/setlists?p=1';

function getFirstElement(arr) {
	return arr[0];
}

String.prototype.capitalize = function() {
   return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

setList.getUserInput = () => {
	$('form').on('submit', function(e){
		e.preventDefault();
		$('.artistCardContainer').empty();
		let artistName = $('input').val().toLowerCase().capitalize();
		console.log(artistName);

		setList.getArtistInfo(artistName);
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
	}).then(function(res) {
		let artist = res.artist;
		let nameArray = artist.filter((item) => {
			return item.name === userArtist
		})
		let noDis = nameArray.filter((dis) => {
			return dis.disambiguation != null
		})
		console.log(nameArray);
		console.log(noDis);

		for (let i = 0; i < noDis.length; i++) {
			setList.displayCards(noDis[i].name, noDis[i].disambiguation, noDis[i].mbid);
		}
	});
}

setList.displayCards = (name, desc, mbid) => {
	let artistCard = $('<div>').addClass('artistCard').attr('id', mbid);
	let artistCardName = $('<h3>').text(name);
	let artistCardDesc = $('<p>').text(desc);
	// let artistCardId = $('<p>').text(mbid);

	let bandCard = artistCard.append(artistCardName, artistCardDesc);
	$('.artistCardContainer').append(bandCard);
}
// setList.getVenueInfo = (artistId) => {
// 	$.ajax({
// 		url: 'http://proxy.hackeryou.com',
// 		dataType: 'json',
// 		method:'GET',
// 		data: {
// 			reqUrl: `https://api.setlist.fm/rest/1.0/artist/${artistId}/setlists`,
// 			params: {
// 				p: '1'
// 			},
// 			proxyHeaders: {
// 				'x-api-key': setList.apiKey,
// 				Accept: 'application/json'
// 			},
// 			xmlToJSON: false
// 		}
// 	}).then(function(res) {
// 		console.log(res);
// 		let setlists = res.setlist;
// 		setList.recentShows(setlists);
// 	});
// }

// setList.recentShows = (arr) => {
// 	for(let i = 0; i < 6 && i < arr.length; i++){
// 		console.log(arr[i]);
// 	}
// }

setList.init = () => {
	setList.getUserInput();
}

$(function(){
	setList.init();
});