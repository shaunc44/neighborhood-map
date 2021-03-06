//Locations' Array
var locations = [
	{
		name: "American Flatbread",
		lat: 44.4765430,
		lng: -73.2142900,
		id: "4af3a181f964a520fcee21e3"
	},
	{
		name: "Battery Park",
		lat: 44.4813020,
		lng: -73.2198930,
		id: "4b48eb94f964a5206a5d26e3"
	},
	{
		name: "Ben & Jerry's",
		lat: 44.4794430,
		lng: -73.2125320,
		id: "4ab3e8f3f964a520126f20e3"
	},
	{
		name: "Burton Snowboards Flagship Store",
		lat: 44.4510040,
		lng: -73.2142670,
		id: "4b3a1810f964a520fd6025e3"
	},
	{
		name: "Church Street Marketplace",
		lat: 44.4781653,
		lng: -73.2126255,
		id: "4a6ca420f964a5201ad11fe3"
	},
	{
		name: "Citizen Cider",
		lat: 44.4706803,
		lng: -73.214242,
		id: "533f48d3498eb76534dffbb2"
	},
	{
		name: "Feldman's Bagels",
		lat: 44.4610800,
		lng: -73.2139810,
		id: "5181287b498e5c6fcf5d46d2"
	},
	{
		name: "Flynn Center for the Performing Arts",
		lat: 44.475682,
		lng: -73.2131557,
		id: "4bc1bca8920eb7135f151b2c"
	},
	{
		name: "Hen of the Wood",
		lat: 44.4791015,
		lng: -73.2173644,
		id: "52508dcd11d28b42e127ab1e"
	},
	{
		name: "Lake Champlain Chocolates",
		lat: 44.4586590,
		lng: -73.2112440,
		id: "4b6b070af964a5209aed2be3"
	},
	{
		name: "Penny Cluse Café",
		lat: 44.4737720,
		lng: -73.2107190,
		id: "4a6ca0a2f964a5200cd11fe3"
	},
	{
		name: "Red Onion",
		lat: 44.4764259,
		lng: -73.212299,
		id: "4b4cbd1ef964a520a4bc26e3"
	},
	{
		name: "Switchback Brewing",
		lat: 44.456184,
		lng: -73.220686,
		id: "4be993be62c0c928f7cddfd4"
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
	}
];


//Initialize map of Burlington, VT
var map;
function initMap() {
	"use strict";
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 44.47125, lng: -73.2125},
		zoom: 14,
		mapTypeControl: true,
		mapTypeControlOptions: {
			position: google.maps.ControlPosition.LEFT_BOTTOM
		}
	});

	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center);
	});

	ko.applyBindings(new ViewModel());
}


//Alert user when google maps is not working
function googleError() {
	document.getElementById('map').innerHTML = "<h2>Google Maps is not loading. Please refresh the page later.</h2>";
}


//Place constructor
var Place = function (data) {
	var self = this;
	self.name = ko.observable(data.name);
	self.lat = ko.observable(data.lat);
	self.lng = ko.observable(data.lng);
	self.id = ko.observable(data.id);
	self.marker = ko.observable();
	self.phone = ko.observable('');
	self.description = ko.observable('');
	self.address = ko.observable('');
	self.rating = ko.observable('');
	self.url = ko.observable('');
	self.canonicalUrl = ko.observable('');
	self.photoPrefix = ko.observable('');
	self.photoSuffix = ko.observable('');
	self.contentString = ko.observable('');
};


//ViewModel
var ViewModel = function () {
	var self = this;

	//Create an array of all places
	self.placeList = ko.observableArray([]);

	//Create Place objects for each location item & store in the above array
	locations.forEach(function(placeItem) {
		self.placeList.push(new Place(placeItem));
	});

	//Initialize the Infowindow
	var infowindow = new google.maps.InfoWindow({
		maxWidth: 200
	});

	//Initialize markers
	var marker;
	self.placeList().forEach(function (placeItem) {
		// Define markers for each place
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(placeItem.lat(),placeItem.lng()),
			map: map,
			animation: google.maps.Animation.DROP
		});
		placeItem.marker = marker;

		// Make AJAX requests to Foursquare
		$.ajax({
			url: 'https://api.foursquare.com/v2/venues/' + placeItem.id() + '?client_id=OS1S4RTHIBE0UB0IZXWOMTNBTKR0OORIGMBHTKOMMLG5DVSY&client_secret=KVDZNXLVF2HSZCWLRXOA0SZ4HCYIW2NCBTYATX2ZYYHRHSFA&v=20130815',
			dataType: "json",

		//Display of infowindow
		}).done(function (data) {
				var result = data.response.venue;

				var contact = result.hasOwnProperty('contact') ? result.contact : '';
				if (contact.hasOwnProperty('formattedPhone')) {
					placeItem.phone(contact.formattedPhone || '');
				}

				var location = result.hasOwnProperty('location') ? result.location : '';
				if (location.hasOwnProperty('address')) {
					placeItem.address(location.address || '');
				}

				var bestPhoto = result.hasOwnProperty('bestPhoto') ? result.bestPhoto : '';
				if (bestPhoto.hasOwnProperty('prefix')) {
					placeItem.photoPrefix(bestPhoto.prefix || '');
				}

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

				//Foursquare infowindow content
				var contentString = '<div id="iWindow">' +
					'<h5><b>' + placeItem.name() + '</b></h5>' +
					'<div id="pic">' +
						'<img src="' +
							placeItem.photoPrefix() + '150x110' +
							placeItem.photoSuffix() +
						'" alt="Image Location">' +
					'</div>' +
					'<div>' + placeItem.phone() + '</div>' +
					'<p>' + placeItem.address() + '</p>' +
					'<p>' + placeItem.description() + '</p>' +
					'<div>' + 'Rating: ' + placeItem.rating() + '</div>' +
					'<div>' +
						'<a href=' +
							placeItem.url() + '>' +
							placeItem.url() +
						'</a>' +
					'</div>' +
					'<a target="_blank" href=' +
						placeItem.canonicalUrl() + '>Foursquare Page' +
					'</a>' +
					'<p>' +
						'<a target="_blank" href=https://www.google.com/maps/dir/Current+Location/' +
							placeItem.lat() + ',' +
							placeItem.lng() + '>Directions' +
						'</a>' +
					'</p>';

				//Opens infowindow upon click
				google.maps.event.addListener(placeItem.marker, 'click', function() {
						infowindow.open(map, this);
						placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
						setTimeout(function () {
							placeItem.marker.setAnimation(null);
						}, 500);
						infowindow.setContent(contentString);
				});

				/*
				google.maps.event.addListener(placeItem.marker, 'click', 
					$(function runEffect() {
						var options = {};
						$(".container").toggle('slide',250);
					}
					$("#button").click(function() {
						runEffect();
					});
				});
				//});
				*/

		//Foursquare infowindow error
		}).fail(function () {
			infowindow.setContent('<h5>Foursquare data is unavailable. Please try refreshing later.</h5>');
			document.getElementById("error").innerHTML = "<h4>Foursquare data is unavailable. Please try refreshing later.</h4>";
		});

		//Event listener shows error msg on AJAX in the infowindow
		google.maps.event.addListener(marker, 'click', function () {
			infowindow.open(map, this);
			placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function () {
				placeItem.marker.setAnimation(null);
			}, 500);
		});
	});

	//Activate the appropriate marker when the user mouses over a list item
	self.showInfo = function(placeItem) {
		google.maps.event.trigger(placeItem.marker, 'click');
		self.hideElements();
	};

	//Toggle the nav class based style
	self.toggleNav = ko.observable(false);
	this.navStatus = ko.pureComputed (function () {
		return self.toggleNav() === false ? 'nav' : 'navClosed';
		}, this);

	self.hideElements = function (toggleNav) {
		self.toggleNav(true);
		return true;
	};

	self.showElements = function (toggleNav) {
		self.toggleNav(false);
		return true;
	};

	//Filter markers per user input
	//Array reveals only visible markers based on search
	self.visible = ko.observableArray();

	//All markers are visible by default before any user input
	self.placeList().forEach(function (place) {
		self.visible.push(place);
	});

	//Track user input
	self.userInput = ko.observable('');

	//If user input is included in the place name make visible
	//If not, remove the place & marker
	self.filterMarkers = function () {

		//Set all markers and places to not visible.
		var searchInput = self.userInput().toLowerCase();
		self.visible.removeAll();
		self.placeList().forEach(function (place) {
			place.marker.setVisible(false);

			//If user input is part of list set the place and marker as visible
			if (place.name().toLowerCase().indexOf(searchInput) !== -1) {
				self.visible.push(place);
			}
		});
		self.visible().forEach(function (place) {
			place.marker.setVisible(true);
		});
	};

};//ViewModel
