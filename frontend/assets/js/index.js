// Visualizing Stuff in Maps: https://developers.google.com/maps/documentation/javascript/earthquakes

// -Define Incident Types, Make Pie Chart
// -Click on Marker Window https://developers.google.com/maps/documentation/javascript/examples/infowindow-simple

//Init Firebase: --> data in credentials.js
firebase.initializeApp({
    apiKey: data.apiKey,
    authDomain: data.authDomain,
    projectId: data.projectId
});

// Initialize Cloud Firestore through Firebase
//var db = firebase.firestore();

// Disable deprecated features
db.settings({
    timestampsInSnapshots: true
});

var jsonObject;
var map;




//Get JSON Data, then add to map.data
db.collection("features").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        //console.log(`${doc.id} => ${doc.data()}`);
        jsonObject = doc.data();
        console.log(jsonObject);
        map.data.addGeoJson(jsonObject); //Data is added to Gmap and then setStyle in initMap--> Circle with magnitude
    });
});

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


        // console.log(places[0].geometry.viewport);
        // console.log(places[0].geometry.viewport.ga.j); //long
        // console.log(places[0].geometry.viewport.ga.l); //long
        // console.log(places[0].geometry.viewport.ma.j); //lat
        // console.log(places[0].geometry.viewport.ma.l); //lat

        var longA = places[0].geometry.viewport.ga.j; //long
        var longB = places[0].geometry.viewport.ga.l; //long
        var latA = places[0].geometry.viewport.ma.j; //lat
        var latB = places[0].geometry.viewport.ma.l; //lat
     
        var apiURL = "https://data.police.uk/api/crimes-street/all-crime?poly="
            + latA + "," + longA + ":" + latA + "," + longB + ":" + latB + "," + longB + ":" + latB + "," + longA + ":" + latA + "," + longA + "&date=2017-01"

        // Old, returns half of the area as triangle
        // var apiURL = "https://data.police.uk/api/crimes-street/all-crime?poly="
        //     + latA + "," + longA + ":" + latB + "," + longB + ":" + latA + "," + longB + "&date=2017-01"



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




        $.getJSON(apiURL, function (data) {
            $.each(data, function (index, value) {

                if (value.outcome_status !== null) {
                    objectStatus = value.outcome_status.category + ", " + value.outcome_status.date;
                } else {
                    objectStatus = "no data available";
                }
                if (value.category.includes("burglary") || value.category.includes("shoplifting") || value.category.includes("theft") || value.category.includes("robbery")) {
                    value.genCategory = "Theft";
                    value.skala = "5.5";
                    countCategory.theft++;
                } else
                    if (value.category.includes("social") || value.category.includes("drugs") || value.category.includes("public") || value.category.includes("damage")) {
                        value.genCategory = "Public Offenses";
                        value.skala = "5";
                        countCategory.publicOffenses++;
                    } else
                        if (value.category.includes("vehicle")) {
                            value.genCategory = "Traffic"
                            value.skala = "5";
                            countCategory.traffic++;
                        } else
                            if (value.category.includes("violent")) {
                                value.genCategory = "Violence"
                                value.skala = "5.8";
                                countCategory.violence++;
                            } else {
                                value.genCategory = "Undefined"
                                countCategory.undefined++;
                            }


                // PUBLIC OFFENSES
                // Anti-social-behaviour
                // drugs
                // public order
                // criminal-damage-arson

                // TRAFFIC
                // vehicle crime

                // Theft 
                // shoplifting
                // other-theft
                // burglary
                // robbery
                // theft-from-the-person

                // VIOLENCE
                // violent-crime




                plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                var longInt = parseFloat(value.location.longitude);
                var longMath = 0.00002 / ((Math.floor(Math.random() * 5) + 0.001));
                longRand = longInt + (longMath * plusOrMinus);

                plusOrMinus = Math.random() < 0.5 ? -1 : 1;
                var latInt = parseFloat(value.location.latitude);
                var latMath = 0.00002 / ((Math.floor(Math.random() * 5) + 0.001));
                latRand = latInt + (latMath * plusOrMinus);

                geoApiData.features.push({
                    "geometry": {
                        "coordinates": [
                            parseFloat(longRand),
                            parseFloat(latRand)
                        ],
                        "type": "Point"
                    },
                    "properties": {
                        "skala": value.skala,
                        "genCategory": value.genCategory,
                        "category": value.category,
                        "place": value.location.street.name,
                        "time": value.month,
                        "url": "https://data.police.uk/data/",
                        "status": objectStatus,
                        "sources": "UK Police Crime API"
                    },
                    "type": "Feature"
                });
            });

            countCategory.all = countCategory.publicOffenses + countCategory.traffic + countCategory.theft + countCategory.violence + countCategory.undefined;
            $(".publicOffenses").html(countCategory.publicOffenses);
            $(".traffic").html(countCategory.traffic);
            $(".theft").html(countCategory.theft);
            $(".violence").html(countCategory.violence);
            $(".undefined").html(countCategory.undefined);
            $(".all").html(countCategory.all);
            window.countCategory = countCategory;
            $(window).trigger('changeData', countCategory);


            var bar1 = (countCategory.publicOffenses / countCategory.all) * 100;
            var bar2 = (countCategory.traffic / countCategory.all) * 100;
            var bar3 = (countCategory.theft / countCategory.all) * 100;
            var bar4 = (countCategory.violence / countCategory.all) * 100;

            // console.log(bar1)
            // console.log(bar2)
            // console.log(bar3)
            // console.log(bar4)

            var styleNode = document.createElement('style');
            styleNode.type = "text/css";
            var styleText = document.createTextNode('#bar1 { width: ' + bar1 + '%; } #bar2 { width: ' + bar2 + '%; } #bar3 { width: ' + bar3 + '%; } #bar4 { width: ' + bar4 + '%; }');
            styleNode.appendChild(styleText);
            document.getElementsByTagName('head')[0].appendChild(styleNode);




            map.data.addGeoJson(geoApiData); //Data is added to Gmap and then setStyle in initMap--> Circle with magnitude




        })
            .fail(function (jqxhr) {
                console.log("503?")
                alert("To many results in this area. Please specify a smaller region");
            });



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

        var areaCoordinates = [
            { lat: latA, lng: longA },
            { lat: latA, lng: longB },
            { lat: latB, lng: longB },
            { lat: latB, lng: longA },
            { lat: latA, lng: longA }
        ];

        var areaLiner = new google.maps.Polyline({
            path: areaCoordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 0.25,
            strokeWeight: 2
        });

        areaLiner.setMap(map);


    })






    // OLD DATA FROM FIRESTORE RED CIRCLES
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

        //  var featureData = {"category": category, "skala": skala,"place": place,"url": url,"status": status,"sources": sources,}
        //  console.log(featureData);

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
        var genProp = feature.getProperty('genCategory')
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
                        color = 'grey'
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









//Realtime Updates https://firebase.google.com/docs/firestore/query-data/listen
// db.collection("users").doc("SF")
//     .onSnapshot(function(doc) {
//         console.log("Current data: ", doc.data());
//         console.log(doc.data());
//     });



// Add Stuff to DB


// db.collection("features").add({
//     "type": "FeatureCollection",
//     "features": [
//         {
//             "type": "Feature",
//             "properties": {
//                 "skala": 6,
//                 "category": "Awesomeness",
//                 "place": "Dresdner Straße 26 04317 Leipzig",
//                 "time": 1348174056,
//                 "url": "http://google.com",
//                 "status": "aktuell",
//                 "sources": "twitter"
//             },
//             "geometry": {
//                 "type": "Point",
//                 "coordinates": [
//                     12.389230728149414,
//                     51.33372202647613
//                 ]
//             }
//         },
//         {
//             "type": "Feature",
//             "properties": {
//                 "skala": 6,
//                 "category": "Awesomeness",
//                 "place": "Dresdner Straße 26 04317 Leipzig",
//                 "time": 1348174056,
//                 "url": "http://google.com",
//                 "status": "aktuell",
//                 "sources": "twitter"
//             },
//             "geometry": {
//                 "type": "Point",
//                 "coordinates": [
//                     12.397384643554688,
//                     51.34605424944661
//                 ]
//             }
//         },
//         {
//             "type": "Feature",
//             "properties": {
//                 "skala": 6,
//                 "category": "Awesomeness",
//                 "place": "Dresdner Straße 26 04317 Leipzig",
//                 "time": 1348174056,
//                 "url": "http://google.com",
//                 "status": "aktuell",
//                 "sources": "twitter"
//             },
//             "geometry": {
//                 "type": "Point",
//                 "coordinates": [
//                     12.392749786376951,
//                     51.33870893358745
//                 ]
//             }
//         },
//         {
//             "type": "Feature",
//             "properties": {
//                 "skala": 6,
//                 "category": "Awesomeness",
//                 "place": "Dresdner Straße 26 04317 Leipzig",
//                 "time": 1348174056,
//                 "url": "http://google.com",
//                 "status": "aktuell",
//                 "sources": "twitter"
//             },
//             "geometry": {
//                 "type": "Point",
//                 "coordinates": [
//                     12.398242950439453,
//                     51.34315915601202
//                 ]
//             }
//         }
//     ]
// })
//     .then(function (docRef) {
//         console.log("Document written with ID: ", docRef.id);
//     })
//     .catch(function (error) {
//         console.error("Error adding document: ", error);
//     });