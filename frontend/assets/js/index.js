var jsonObject;
var map;

//Init GMap
function initAutocomplete() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: { lat: 47.5162, lng: 14.55 },
        mapTypeId: 'satellite'
    });


    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }

        var markers = [];

        //console.log("Delete previous markers");
        markers.forEach(function (marker) {
            marker.setMap(null);
            console.log("delete");
        });
        markers = [];



        var apiData;
        var geoApiData = {
            features: [],
            "type": "FeatureCollection"
        };

        var objectStatus;
        var genCategory;
        var countCategory = {
            "publicOffenses": 0,
            "traffic": 0,
            "theft": 0,
            "violence": 0,
            "undefined": 0
        };

        var latRand;
        var longRand;
        var plusOrMinus;


        // var apiURL = XXX CONNECT TO PYTHON SERVER

        // $.getJSON(apiURL, function (data) {
        //     $.each(data, function (index, value) {

        //         console.log(value);

        //         plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        //         var longInt = parseFloat(value.location.longitude);
        //         var longMath = 0.00002 / ((Math.floor(Math.random() * 5) + 0.001));
        //         longRand = longInt + (longMath * plusOrMinus);

        //         plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        //         var latInt = parseFloat(value.location.latitude);
        //         var latMath = 0.00002 / ((Math.floor(Math.random() * 5) + 0.001));
        //         latRand = latInt + (latMath * plusOrMinus);


        //         // {
        //         //     "geometry": {
        //         //         "coordinates": [
        //         //             longitude,
        //         //             latitude
        //         //         ],
        //         //         "type": "Point"
        //         //     },
        //         //     "properties": {
        //         //         "property1": 1234,
        //         //         "property2": "add as many properties as you want"
        //         //     },
        //         //     "type": "Feature"
        //         // }

        //         geoApiData.features.push({
        //             "geometry": {
        //                 "coordinates": [
        //                     parseFloat(longRand),
        //                     parseFloat(latRand)
        //                 ],
        //                 "type": "Point"
        //             },
        //             "properties": {
        //                 "skala": value.skala,
        //                 "genCategory": value.genCategory,
        //                 "category": value.category,
        //                 "place": value.location.street.name,
        //                 "time": value.month,
        //                 "url": "https://data.police.uk/data/",
        //                 "status": objectStatus,
        //                 "sources": "UK Police Crime API"
        //             },
        //             "type": "Feature"
        //         });
        //     });


        //     var bar1 = (countCategory.publicOffenses / countCategory.all) * 100;
        //     var bar2 = (countCategory.traffic / countCategory.all) * 100;
        //     var bar3 = (countCategory.theft / countCategory.all) * 100;
        //     var bar4 = (countCategory.violence / countCategory.all) * 100;

        //     // console.log(bar1)
        //     // console.log(bar2)
        //     // console.log(bar3)
        //     // console.log(bar4)

        //     var styleNode = document.createElement('style');
        //     styleNode.type = "text/css";
        //     var styleText = document.createTextNode('#bar1 { width: ' + bar1 + '%; } #bar2 { width: ' + bar2 + '%; } #bar3 { width: ' + bar3 + '%; } #bar4 { width: ' + bar4 + '%; }');
        //     styleNode.appendChild(styleText);
        //     document.getElementsByTagName('head')[0].appendChild(styleNode);


        //     map.data.addGeoJson(geoApiData); //Data is added to Gmap and then setStyle in initMap--> Circle with magnitude

        // }).fail(function (jqxhr) {
        //     alert("Server Error");
        // });

        var testData = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "skala": 6,
                        "category": "Awesomeness",
                        "place": "Dresdner Straße 26 04317 Leipzig",
                        "time": 1348174056,
                        "url": "http://google.com",
                        "status": "aktuell",
                        "sources": "twitter"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            12.389230728149414,
                            51.33372202647613
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "skala": 6,
                        "category": "Awesomeness",
                        "place": "Dresdner Straße 26 04317 Leipzig",
                        "time": 1348174056,
                        "url": "http://google.com",
                        "status": "aktuell",
                        "sources": "twitter"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            12.397384643554688,
                            51.34605424944661
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "skala": 6,
                        "category": "Awesomeness",
                        "place": "Dresdner Straße 26 04317 Leipzig",
                        "time": 1348174056,
                        "url": "http://google.com",
                        "status": "aktuell",
                        "sources": "twitter"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            12.392749786376951,
                            51.33870893358745
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "skala": 6,
                        "category": "Awesomeness",
                        "place": "Dresdner Straße 26 04317 Leipzig",
                        "time": 1348174056,
                        "url": "http://google.com",
                        "status": "aktuell",
                        "sources": "twitter"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            12.398242950439453,
                            51.34315915601202
                        ]
                    }
                }
            ]
        }

        console.log(testData);

        map.data.addGeoJson(testData); //Data is added to Gmap and then setStyle in initMap--> Circle with magnitude

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
            console.log("delete");
        });
        markers = [];



        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
        var zoom = map.getZoom();
        // map.setZoom(zoom = zoom + 0.5);

        // var areaCoordinates = [
        //     { lat: latA, lng: longA },
        //     { lat: latA, lng: longB },
        //     { lat: latB, lng: longB },
        //     { lat: latB, lng: longA },
        //     { lat: latA, lng: longA }
        // ];

        // var areaLiner = new google.maps.Polyline({
        //     path: areaCoordinates,
        //     geodesic: true,
        //     strokeColor: '#FF0000',
        //     strokeOpacity: 0.25,
        //     strokeWeight: 2
        // });

        // areaLiner.setMap(map);


    })






    // InfoWindow Stuff
    var infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(map, 'click', function () {
        infowindow.close();
    });

    map.data.addListener('click', function (event) {
        var category = event.feature.getProperty("category");
        var skala = event.feature.getProperty("skala");
        var genCategory = event.feature.getProperty("genCategory");
        var place = event.feature.getProperty("place");
        var url = event.feature.getProperty("url");
        var status = event.feature.getProperty("status");
        var sources = event.feature.getProperty("sources");

        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }

        infowindow.setContent(
            '<div>' +
            '<h3>' + category.capitalize().replace(/-/g, " ") + '</h3>' +
            '<p></p>' +
            '<p><b>Location:</b> ' + place + '<br /> ' +
            '<b>Category:</b> ' + genCategory + '<br /> ' +
            '<b>Current status:</b> ' + status + '<br /> ' +
            '<b>Information Source:</b> ' + sources + '<br /> ' +
            '<b>Link:</b> <a href=' + url + '>' + url + '</a> </p>' +
            '</div>'

        );
        infowindow.setPosition(event.feature.getGeometry().get());
        infowindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) });
        infowindow.open(map);
    });

    map.data.setStyle(function (feature) {
        var magnitude = feature.getProperty('skala');
        var genProp = feature.getProperty('category')
        var color;

        console.log

        if (genProp.includes("Theft")) {
            color = 'blue'
        } else
            if (genProp.includes("Public")) {
                color = 'green'
            } else
                if (genProp.includes("Traffic")) {
                    color = 'purple'
                } else
                    if (genProp.includes("Violence")) {
                        color = 'red'
                    } else {
                        color = 'yellow'
                    }
        return {
            icon: getCircle(magnitude, color)
        };
    });

}//End Init Map


function getCircle(magnitude, color) {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: .2,
        scale: Math.pow(2, magnitude) / 2,
        strokeColor: 'white',
        strokeWeight: .5
    };
}

function eqfeed_callback(results) {
    map.data.addGeoJson(results);
}





