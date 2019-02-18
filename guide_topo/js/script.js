
var map, client_id, client_secret;

$(document).ready(function() {
  function setHeight() {
    windowHeight = $(window).innerHeight();
    $('#map').css('min-height', windowHeight);
    $('#sidebar').css('min-height', windowHeight);
  };
  setHeight();

  $(window).resize(function() {
    setHeight();
  });
});


var places = [
    {
        title: 'shosha shop',
        lat: 51.601409,
        lng:  -0.018823,
        type: 'Living Quarters'
    },
    {
        title: 'mohamed Restaurant',
        lat: 51.6023146,
        lng: -0.0187593,
        type: 'Restaurant'
    },
    
    
    {
        title: 'a7atteet',
        lat: 51.600575,
        lng: -0.017354,
        type: 'Shopping'
    },
 
    {
        title: 'moka colabb',
        lat: 51.606066,
        lng: -0.017345,
        type: 'Restaurant'
    },
    {
        title: 'snakes',
        lat: 51.604905,
        lng: -0.018967,
        type: 'Restaurant'
    }
]

function Model() {
    var self = this;

    this.searchOption = ko.observable("");
    this.markers = [];

    // This function populates the infowindow when the marker is clicked. We'll only allow
    this.populate_window = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;
            // API Client
            client_id = "MW30DVMHC1GXIISKDF3B1IJLGH2UTJOGENPOWM15AJMN1HNK";
            client_secret =
                "WBZQPVDYZT5S5GN5SR13H1ZZ4ZV5NHP4KW12B4KNIQRLZIYY";
            // URL   API
            var api_url = 'https://api.foursquare.com/v2/venues/search?ll=' +
                marker.lat + ',' + marker.lng + '&client_id=' + client_id +
                '&client_secret=' + client_secret + '&query=' + marker.title +
                '&v=20170708' + '&m=foursquare';
            //  API
            $.getJSON(api_url).done(function(marker) {
                var response_name = marker.response.venues[0];
                self.street_name = response_name.location.formattedAddress[0];
                self.city_name = response_name.location.formattedAddress[1];
                self.zip_name = response_name.location.formattedAddress[3];
                self.country_name = response_name.location.formattedAddress[4];
                self.category_name =response_name.categories[0].shortName ? response_name.categories[0].shortName : '';
                self.foursquare_content =
                    '<h5 class="iw_subaw">(' + self.category +
                    ')</h5>' + '<div>' +
                    '<h6 class="iw_address_aw"> Address: </h6>' +
                    '<p class="iw_add">' + self.street_name + '</p>' +
                    '<p class="iw_add">' + self.city_name + '</p>' +
                    '<p class="iw_add">' + self.zip_name + '</p>' +
                    '<p class="iw_add">' + self.country_name +
                    '</p>' + '</div>' + '</div>';

                infowindow.setContent(self.html_Content + self.foursquare_content);
            }).fail(function() {
                // alert
                alert(
                    "peoblem to try again."
                );
            });

            this.html_Content = '<div>' + '<h4 class="iw_aw">' + marker.title +
                '</h4>';

            infowindow.open(map, marker);

            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    };

    this.populateAndBounceMarker = function() {
        self.populate_window(this, self.big_info_window);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 1400);
    };

    this.initMap = function() {
        var map_canvas = document.getElementById('map');
        var map_options = {
           
            center: new google.maps.LatLng(51.6034898, -0.0185944),
            zoom: 15,
            styles: styles
        };
       
        map = new google.maps.Map(map_canvas, map_options
        );

        this.big_info_window = new google.maps.InfoWindow();
        for (var i = 0; i < places.length; i++) {
            this.marke_iner_tritle = places[i].title;
            this.marker_iner_lat = places[i].lat;
            this.marker_iner_lng = places[i].lng;
            //  Maps marker 
            this.marker = new google.maps.Marker({
                map: map,
                position: {
                    lat: this.marker_iner_lat,
                    lng: this.marker_iner_lng
                },
                title: this.marke_iner_tritle,
                lat: this.marker_iner_lat,
                lng: this.marker_iner_lng,
                id: i,
                animation: google.maps.Animation.DROP
            });
            this.marker.setMap(map);
            this.markers.push(this.marker);
            this.marker.addListener('click', self.populateAndBounceMarker);
        }
    };

    this.initMap();

    // This block appends our locations to a list using data-bind

    this.myLocationsFilter = ko.computed(function() {
        var result = [];
        for (var i = 0; i < this.markers.length; i++) {
            var markerLocation = this.markers[i];
            if (markerLocation.title.toLowerCase().includes(this.searchOption()
                    .toLowerCase())) {
                result.push(markerLocation);
                this.markers[i].setVisible(true);
            } else {
                this.markers[i].setVisible(false);
            }
        }
        return result;
    }, this);
}

googleError = function () {
    alert(
        ' Maps not load. please  try again!'
    );
};

function startApp() {
    ko.applyBindings(new Model());
}
