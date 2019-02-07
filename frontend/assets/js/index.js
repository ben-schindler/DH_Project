var jsonObject;
var map;


//Init GMap
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3.5,
        center: { lat: 30, lng: 35 },
        mapTypeId: 'satellite'
    });


    // Create the search box and link it to the UI element.
    //var input = document.getElementById('pac-input');
    //var searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // // Bias the SearchBox results towards current map's viewport.
    // map.addListener('bounds_changed', function () {
    //     searchBox.setBounds(map.getBounds());
    // });

    // // Listen for the event fired when the user selects a prediction and retrieve
    // // more details for that place.
    // searchBox.addListener('places_changed', function () {
    //     var places = searchBox.getPlaces();
    //     if (places.length == 0) {
    //         return;
    //     }


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


    // var apiURL = "https://jsonplaceholder.typicode.com/todos"

    // $.getJSON(apiURL, function (data) {

    //     console.log(data);

    //     $.each(data, function (index, value) {
    //         //console.log(value);
    //     }); // END LOOP EACH DATA ENTRY

    //     // map.data.addGeoJson(geoApiData); //Data is added to Gmap and then setStyle in initMap--> Circle with magnitude

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
    //console.log(testData);


    //get placeFeatures variable from js import in index.html
    console.log(placeFeatures);

    localStorage.setItem('placesloaded', 0);

    // on button click 
    $("#placesButton").click(function () {

        loadplaces = localStorage.getItem('placesloaded');

        if (loadplaces == 0) {

            map.data.addGeoJson(placeFeatures); //Data is added to Gmap and then setStyle in initMap--> Circle with magnitude

            var chartData = [];
            var countPlaces;
            var countCategory = {
                "settlements": 0,
                "geographical": 0,
                "people": 0,
                "other": 0
            };

            $.each(placeFeatures.features, function (i, item) {
                //console.log(item.properties.featureTypes);
                countPlaces = i++;
                if (item.properties.featureTypes.includes("settlement")) {
                    item.properties.genCategory = "Settlement"
                    countCategory.settlements++;
                } else if (item.properties.featureTypes.includes("river") || item.properties.featureTypes.includes("island") || item.properties.featureTypes.includes("mountain") || item.properties.featureTypes.includes("water")) {
                    item.properties.genCategory = "Geographical"
                    countCategory.geographical++;
                } else if (item.properties.featureTypes.includes("province") || item.properties.featureTypes.includes("people") || item.properties.featureTypes.includes("station")) {
                    item.properties.genCategory = "People"
                    countCategory.people++;
                } else {
                    item.properties.genCategory = "Other"
                    countCategory.other++;
                }
                chartData.push([item.properties.count, item.properties.title, item.properties.featureTypes, item.properties.timePeriodsKeys, item.properties.description]);
            });

            console.log(countPlaces);
            console.log(countCategory.settlements)
            console.log(countCategory.geographical)
            console.log(countCategory.people)
            console.log(countCategory.other)


            countCategory.all = countCategory.settlements + countCategory.geographical + countCategory.people + countCategory.other;
            $(".settlements").html(countCategory.settlements);
            $(".geographical").html(countCategory.geographical);
            $(".people").html(countCategory.people);
            $(".other").html(countCategory.other);
            window.countCategory = countCategory;
            $(window).trigger('changeData', countCategory);
            
            
            // var bar1 = (countCategory.publicOffenses / countCategory.all) * 100;
            // var bar2 = (countCategory.traffic / countCategory.all) * 100;
            // var bar3 = (countCategory.theft / countCategory.all) * 100;
            // var bar4 = (countCategory.violence / countCategory.all) * 100;
            // console.log(bar1)
            // console.log(bar2)
            // console.log(bar3)
            // console.log(bar4)
            // var styleNode = document.createElement('style');
            // styleNode.type = "text/css";
            // var styleText = document.createTextNode('#bar1 { width: ' + bar1 + '%; } #bar2 { width: ' + bar2 + '%; } #bar3 { width: ' + bar3 + '%; } #bar4 { width: ' + bar4 + '%; }');
            // styleNode.appendChild(styleText);
            // document.getElementsByTagName('head')[0].appendChild(styleNode);




            $('#chartData').DataTable({
                data: chartData,
                columns: [
                    { title: "Count" },
                    { title: "Title" },
                    { title: "Category" },
                    { title: "Time Period" },
                    { title: "Description" }
                ]
            });
            localStorage.setItem('placesloaded', 1);
        }

        if (loadplaces == 1) {

            alert("Places already loaded");
        }
    });


    $("#otherButton").click(function () {
        alert("Not yet implemented");
    });

    // Clear out the old markers.
    markers.forEach(function (marker) {
        marker.setMap(null);
        console.log("delete");
    });
    markers = [];




    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    markers.forEach(function (place) {
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
    //map.fitBounds(bounds);


    // InfoWindow Stuff
    var infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(map, 'click', function () {
        infowindow.close();
    });

    map.data.addListener('click', function (event) {

        var title = event.feature.getProperty("title");
        var count = event.feature.getProperty("count");
        var featureTypes = event.feature.getProperty("featureTypes");
        var timePeriodsKeys = event.feature.getProperty("timePeriodsKeys");
        var maxDate = event.feature.getProperty("maxDate");
        var minDate = event.feature.getProperty("minDate");
        var count = event.feature.getProperty("count");
        var description = event.feature.getProperty("description");
        var url = "https://pleiades.stoa.org/";



        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }

        infowindow.setContent(
            '<div>' +
            '<h3>' + title + '</h3>' +
            '<p></p>' +
            '<p><b>Occurences:</b> ' + count + '<br /> ' +
            '<b>Category:</b> ' + featureTypes + '<br /> ' +
            '<b>Time Period:</b> ' + timePeriodsKeys + '<br /> ' +
            '<b>Years active A.D.:</b> ' + minDate + ' until ' + maxDate + '<br /> ' +
            '<b>Description:</b> ' + description + '<br /> ' +
            '<b>Source:</b> <a href=' + url + '>' + url + '</a> </p>' +
            '</div>'

        );
        infowindow.setPosition(event.feature.getGeometry().get());
        infowindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) });
        infowindow.open(map);
    });

    map.data.setStyle(function (feature) {
        var magnitude = feature.getProperty('count');
        var topic = "places" //add topic to data when more than one
        var color;

        console.log

        if (topic.includes("topic1")) {
            color = 'blue'
        } else
            if (topic.includes("topic2")) {
                color = 'green'
            } else {
                color = 'red'
            }
        return {
            icon: getCircle(magnitude, color)
        };
    });

    //End Init Map


    function getCircle(magnitude, color) {
        // console.log(magnitude);

        var calcScale
        // calcScale = 9;
        calcScale = Math.sqrt(magnitude + 60);
        // console.log(calcScale);

        // if (magnitude <= 15) {
        //     calcScale = magnitude * 2;
        // } else {
        //     console.log(magnitude)
        //     calcScale = 15 + ( (magnitude * 2 ) / 30)
        //     console.log(calcScale)
        // }

        return {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: color,
            fillOpacity: .2,
            scale: calcScale,
            strokeColor: 'white',
            strokeWeight: .5
        };
    }

    function eqfeed_callback(results) {
        map.data.addGeoJson(results);
    }



}











