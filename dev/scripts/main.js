const app = {};
app.apiKey = 'c649f061-c881-4cdb-9812-736b4f04b4b8';
app.firstBaseUrl = 'https://api.setlist.fm/rest/1.0/search/artists?p=1&sort=sortName';
app.venueBaseUrl = 'https://api.setlist.fm/rest/1.0/artist/c649f061-c881-4cdb-9812-736b4f04b4b8/setlists?p=1';


function handleSubmit(e) {
	e.preventDefault();
	let artist = $('.artist').val();

};
app.getArtis = (id) => {
return $.ajax({
		url: app.firstBaseUrl,
		method: 'GET',
		dataType: 'jsonp',
			data: {
				reqUrl: app.baseUrl
			},
	}).then(function() {
		
	});
};

app.events = () => {
	$('form').on('submit');
	console.log('it works');
};

app.init = function(){
	app.events();
};


$(app.init);
