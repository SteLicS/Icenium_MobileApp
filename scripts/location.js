define(["jQuery", "kendo"], function ($, kendo) {
    console.log('define location')
    var LocationViewModel = kendo.data.ObservableObject.extend({
        _lastMarker: null,
        _isLoading: false,
        address: "",
        onNavigateHome: function () {
            
            console.log('onNavigateHome')

            var that = this,
                position;
            
            that._isLoading = true;
            that.showLoading();
            
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    console.log('success')

                    position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    app.views.location.map.panTo(position);
                    that._putMarker(position);

                    that._isLoading = false;
                    that.hideLoading();
                },
                function (error) {
                    console.log('error')
                    //default map coordinates                    
                    position = new google.maps.LatLng(43.459336, -80.462494);
                    app.views.location.map.panTo(position);

                    that._isLoading = false;
                    that.hideLoading();

                    navigator.notification.alert("Unable to determine current location. Cannot connect to GPS satellite.",
                        function () { }, "Location failed", 'OK');
                },
                {
                    timeout: 30000,
                    enableHighAccuracy: true
                }
            );
        },
        onSearchAddress: function () {
            console.log('onSearchAddress')
            var that = this;
            app.views.location.geocoder.geocode(
                {
                    'address': $('#map-address').val()
                },
                function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        navigator.notification.alert("Unable to find address.",
                            function () { }, "Search failed", 'OK');
                        return;
                    }

                    app.views.location.map.panTo(results[0].geometry.location);
                    that._putMarker(results[0].geometry.location);
                });
        },
        showLoading: function () {
            if (this._isLoading) {
                app.showLoading();
            }
        },

        hideLoading: function () {
            app.hideLoading();
        },

        _putMarker: function (position) {
            var that = this;

            if (that._lastMarker !== null && that._lastMarker !== undefined) {
                that._lastMarker.setMap(null);
            }

            that._lastMarker = new google.maps.Marker({
                map: app.views.location.map,
                position: position
            });
        }
    });
    
    function onDeviceReady()
    {
        var mapOptions = {
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoomControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    },
    
                    mapTypeControl: false,
                    streetViewControl: false
                };

        app.views.location.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);            
        app.views.location.geocoder = new google.maps.Geocoder();
        app.views.location.viewModel= new LocationViewModel();
        app.views.location.viewModel.onNavigateHome()

    }
     return {
        // inizializza l'app
        map:null,
        geocoder:null,
        viewModel: null,
        init: function () {
            console.log('deviceready location init')
            document.addEventListener("deviceready", onDeviceReady, false);
        },
        show: function(){
            console.log('location show')   
            app.views.location.viewModel.showLoading();
            
            //resize the map in case the orientation has been changed while showing other tab
            google.maps.event.trigger(app.views.location.map, "resize");
        },
        hide: function () {
            //hide loading mask if user changed the tab as it is only relevant to location tab
            app.views.location.viewModel.hideLoading();
        }, 
        navigateHome: function(){
             app.views.location.viewModel.onNavigateHome();
            console.log('location navigateHome')   
        },
        searchAddress: function(){
            app.views.location.viewModel.onSearchAddress();
            console.log('location searchAddress')   
        }
     
     }
    
    
    
});
