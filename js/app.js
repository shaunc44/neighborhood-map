//Locations' Array
var locations = [
	{
		name: "Church Street Marketplace",
		lat: 44.4781653,
		lng: -73.2126255,
		id: "4a6ca420f964a5201ad11fe3"
	},
	{
		name: "University of Vermont",
		lat: 44.4778528, 
		lng: -73.1964637,
		id: "4c2b717857a9c9b670e3f567"
	},
	{
		name: "Waterfront Park",
		lat: 44.4800847,
		lng: -73.2214102,
		id: "4bb8e3fa98c7ef3b058a3102"
	},
	{
		name: "Switchback Brewing",
		lat: 44.456184,
		lng: -73.220686,
		id: "44be993be62c0c928f7cddfd4"
	},
	{
		name: "Citizen Cider",
		lat: 44.4706803,
		lng: -73.214242,
		id: "533f48d3498eb76534dffbb2"
	},
	{
		name: "Hen of the Wood",
		lat: 44.4791015,
		lng: -73.2173644,
		id: "52508dcd11d28b42e127ab1e"
	},
	{
		name: "Red Onion",
		lat: 44.4764259,
		lng: -73.212299,
		id: "4b4cbd1ef964a520a4bc26e3"
	},
	{
		name: "Flynn Center for the Performing Arts",
		lat: 44.475682,
		lng: -73.2131557,
		id: "4bc1bca8920eb7135f151b2c"
	}
];

//Initialize the map
var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 44.47125, lng: -73.2125},
		zoom: 14
	});
ko.applyBindings(new ViewModel());
}

// Alert the user if google maps isn't working
function googleError() {
	"use strict";
	document.getElementById('map').innerHTML = "<h2>Google Maps is not loading</h2>";
};


// Place constructor
var Place = function(data) {
	"use strict";
	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.id = ko.observable(data.id);
	this.marker = ko.observable();
	this.phone = ko.observable('');
	this.description = ko.observable('');
	this.address = ko.observable('');
	this.rating = ko.observable('');
	this.url = ko.observable('');
	this.canonicalUrl = ko.observable('');
	this.photoPrefix = ko.observable('');
	this.photoSuffix = ko.observable('');
	this.contentString = ko.observable('');
};

// ViewModel
var ViewModel = function() {
	var self = this;

	// Create an array of all places
	this.placeList = ko.observableArray([]);

	// Create Place objects for each item in locations & store them in the above array
	locations.forEach(function (placeItem) {
		self.placeList.push(new Place(placeItem));
	});

	// Initialize the infowindow
	var infowindow = new google.maps.InfoWindow();

	// Initialize marker
	var marker;

	self.placeList().forEach(function (placeItem) {

		// Define markers for each place
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(placeItem.lat(),placeItem.lng()),
			map: map,
			animation: google.maps.Animation.DROP,
			title: placeItem.name()
		});
		placeItem.marker = marker;


		// Make AJAX request to Foursquare
		$.ajax({
			url: 'https://api.foursquare.com/v2/venues/search' + placeItem.id() + '?client_id=OS1S4RTHIBE0UB0IZXWOMTNBTKR0OORIGMBHTKOMMLG5DVSY&client_secret=KVDZNXLVF2HSZCWLRXOA0SZ4HCYIW2NCBTYATX2ZYYHRHShFA&v=20130815&ll=',
			dataType: "json",

			success: function(data) {
				var result = data.response.venue;
				console.dir(placeItem.name());
				console.dir(result);
				placeItem.name(result.name);

				var contact = result.hasOwnProperty('contact') ? result.contact : '';
				if (contact.hasOwnProperty('formattedPhone')) {
				    placeItem.phone(contact.formattedPhone || '');
				}

				var location = result.hasOwnProperty('location') ? result.location : '';
				if (location.hasOwnProperty('address')) {
				    placeItem.address(location.address || '');
				}

				var bestPhoto = result.hasOwnProperty('bestPhoto') ? result.bestPhoto : '';
				if (bestPhoto.hasOwnProperty('suffix')) {
				    placeItem.photoSuffix(bestPhoto.suffix || '');
				}

				var description = result.hasOwnProperty('description') ? result.description : '';
				placeItem.description(description || '');

				var rating = result.hasOwnProperty('rating') ? result.rating : '';
				placeItem.rating(rating || 'none');

				var url = result.hasOwnProperty('url') ? result.url : '';
				placeItem.url(url || '');

				placeItem.canonicalUrl(result.canonicalUrl);
			},

			// this cause the map to go blank??????
			error: function(e) {
				infowindow.setContent('<h5>Foursquare data is unavailable. Please try refreshing later.</h5>')
			}
		});


		function toggleBounce() {
			if(placeItem.marker.getAnimation() !== null) {
				placeItem.marker.setAnimation(null);
			} else {
				placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
			}
		}

		//Add infowindows
		google.maps.event.addListener(marker, 'click', function () {
			infowindow.open(map, this);
			toggleBounce();
			setTimeout(toggleBounce, 500);

		//getFoursquare();
			infowindow.setContent('<h4>' + placeItem.name() + '</h4><img src="' + placeItem.photoPrefix() + '110x110' + placeItem.photoSuffix() + '" alt="Image Location"><p>Information from Foursquare:</p><p>' + placeItem.phone() + '</p><p>' + placeItem.address() + '</p><p>' + placeItem.description() + '</p><p>Rating: '+ placeItem.rating() + '</p><p><a href=' + placeItem.url() + '>' + placeItem.url() + '</a></p><p><a target="_blank" href=' + placeItem.canonicalUrl() + '>Foursquare Page</a></p><p><a target="_blank" href=https://www.google.com/maps/dir/Current+Location/' + placeItem.lat() + ',' + placeItem.lng() + '>Directions</a></p>')
		});
	});

	self.showInfo = function(placeItem) {
		google.maps.event.trigger(placeItem.marker, 'click');
	};

	// Array containing only the markers based on search
	self.visible = ko.observableArray();

	// All markers are visible by default before any user search
	self.placeList().forEach(function(place) {
		self.visible.push(place);
	});

	// Keep track of user input
	self.userInput = ko.observable('');

	// Filter markers: Set all markers to not visible. 
	// Only display them if they match user search input
	// Credit http://codepen.io/prather-mcs/pen/KpjbNN?editors=001
	self.filterMarkers = function() {
		var searchInput = self.userInput().toLowerCase();
		self.visible.removeAll();
		// Compare the name of each place to the user input
		// If it matches, display the place and marker
		self.placeList().forEach(function(place) {
			place.marker.setVisible(false);
		if (place.name().toLowerCase().indexOf(searchInput) !== -1) {
			self.visible.push(place);
			}
		});
		self.visible().forEach(function(place){
			place.marker.setVisible(true);
		})
	};

}//ViewModel
