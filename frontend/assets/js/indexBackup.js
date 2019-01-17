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
var db = firebase.firestore();

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
        map.data.addGeoJson(jsonObject); //Data is added to Gmap and then setStyle in initMap--> Circle with magnitude
    });
});

//Init GMap
 function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: { lat: 51.3397, lng: 12.3731 },
        mapTypeId: 'terrain'
    });

    var infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(map, 'click', function () {
        infowindow.close();
    });

    map.data.addListener('click', function (event) {
        var category = event.feature.getProperty("category");
        var skala = event.feature.getProperty("skala");
        var place = event.feature.getProperty("place");
        var url = event.feature.getProperty("url");
        var status = event.feature.getProperty("status");
        var sources = event.feature.getProperty("sources");

        //  var featureData = {"category": category, "skala": skala,"place": place,"url": url,"status": status,"sources": sources,}
        //  console.log(featureData);

        infowindow.setContent(
            '<div>' +
                '<h3>' + category + '</h3>' +
                '<p></p>' +
                '<p><b>Ort:</b> ' + place + '<br /> ' +
                '<b>Einstufung der Skala:</b> ' + skala + '<br /> ' +
                '<b>Aktueller Status:</b> ' + status + '<br /> ' +
                '<b>Informationsquelle:</b> ' + sources + '<br /> ' +
                '<b>Link:</b> <a href=' + url + '>' + url + '</a> </p>' +
            '</div>'

        );
        infowindow.setPosition(event.feature.getGeometry().get());
        infowindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) });
        infowindow.open(map);
    });

    map.data.setStyle(function (feature) {
        var magnitude = feature.getProperty('skala');
        return {
            icon: getCircle(magnitude)
        };
    });



}//End Init Map

function getCircle(magnitude) {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'red',
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

db.collection("features").add({
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
})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});