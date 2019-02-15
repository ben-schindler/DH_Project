var jsonObject;
var map;

// https://select2.org/getting-started/basic-usage


var chartPlaces = []

$(document).ready(function () {
    count.features.forEach(function (place) {
        chartPlaces.push({
            "id": 1,
            "text": place.properties.title,
            "countArray": place.properties.Analysis.Count[1]
        });
    });
    console.log(chartPlaces)

    $('.js-example-basic-multiple').select2({
        placeholder: 'Places',
        data: chartPlaces
    });

});


var selectData = [];
$('#selectPlaces').on('select2:select', function (e) {
    selectData.push(e.params.data);
    //console.log(selectData);
});


$("#placesTimeButton").click(function () {
    //console.log(selectData)

    varsForChart = []


    selectData.forEach(function (place) {
        // XXX: Aggriegiere über einzelne Stellen: +1 wenn Zeile vorkommt. Das ist y-wert, X - Wert ist stelle
        // console.log(place)
        // console.log(place.countArray)
        var counts = {};
        for (var i = 0; i < place.countArray.length; i++) {
            var num = place.countArray[i];
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        // console.log(counts);
        // console.log(counts[4]);

        var varsforPlace = []
        for(i=0; i<188; i++){
            if(typeof counts[i] == "undefined"){
                varsforPlace.push(
                    0
                );
            }else{
                varsforPlace.push(
                    counts[i]
                );
            }      
        }
        varsForChart.push(
            varsforPlace
        );
    });
    console.log(varsForChart)
    // labelsForChart();
    // valuesForChart();
    $(window).trigger('changeStatData');
});


var labelsGenerator = []
for(i=0; i<188; i++){
    if(i%25 == 0 || i == 0){
        labelsGenerator.push(
            i
        );
    }else{
        labelsGenerator.push(
            ""
        );
    }
}
console.log(labelsGenerator)

//Labels for Time Series
function labelsForChart() {
    console.log(count);
    var labels = labelsGenerator;
    //console.log(labels)
    return labels;
}
// Values for Time Series
function valuesForChart() {
    var values = varsForChart;
    //console.log(values)
    return values;
}






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
    // console.log(placeFeatures);

    localStorage.setItem('placesloaded', 0);

    // on button click 
    $("#placesButton").click(function () {

        loadplaces = localStorage.getItem('placesloaded');

        if (loadplaces == 0) {

            map.data.addGeoJson(count); //Data is added to Gmap and then setStyle in initMap--> Circle with magnitude

            var chartData = [];
            var countPlaces;
            var countCategory = {
                "settlements": 0,
                "geographical": 0,
                "people": 0,
                "other": 0
            };

            $.each(count.features, function (i, item) {
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
                //console.log(item.properties.Analysis.Count[0])
                chartData.push([item.properties.Analysis.Count[0], item.properties.title, item.properties.featureTypes, item.properties.timePeriodsKeys, item.properties.description]);
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
            localStorage.setItem('count', 1);
        }

        if (loadplaces == 1) {
            alert("Places already loaded. Please refresh page");
        }
    });


    localStorage.setItem('warPlacesloaded', 0);

    // on button click 
    $("#warButton").click(function () {

        loadWarPlaces = localStorage.getItem('warPlacesloaded');

        if (loadWarPlaces == 0) {

            console.log(War_Topic)
            map.data.addGeoJson(War_Topic); //Data is added to Gmap and then setStyle in initMap--> Circle with magnitude

            var chartData = [];
            var countPlaces;
            var countCategory = {
                "settlements": 0,
                "geographical": 0,
                "people": 0,
                "other": 0
            };

            $.each(War_Topic.features, function (i, item) {
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
                chartData.push([item.properties.Analysis.War[0], item.properties.title, item.properties.featureTypes, item.properties.timePeriodsKeys, item.properties.description]);
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
            localStorage.setItem('WarPlacesloaded', 1);
        }

        if (loadWarPlaces == 1) {

            alert("Places already loaded");
        }
    });

    localStorage.setItem('croesusPlacesloaded', 0);

    // on button click 
    $("#croesusButton").click(function () {

        loadCroesusPlaces = localStorage.getItem('croesusPlacesloaded');

        if (loadCroesusPlaces == 0) {

            map.data.addGeoJson(Croesus); //Data is added to Gmap and then setStyle in initMap--> Circle with magnitude
            console.log(Croesus)
            var chartData = [];
            var countPlaces;
            var countCategory = {
                "settlements": 0,
                "geographical": 0,
                "people": 0,
                "other": 0
            };

            $.each(Croesus.features, function (i, item) {
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
                chartData.push([item.properties.Analysis.Count[0], item.properties.title, item.properties.featureTypes, item.properties.timePeriodsKeys, item.properties.description]);
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
            localStorage.setItem('CroesusPlacesloaded', 1);
        }

        if (loadCroesusPlaces == 1) {

            alert("Places already loaded");
        }
    });

    // on button click 
    localStorage.setItem('religionPlacesloaded', 0);
    $("#religionButton").click(function () {
        console.log("Click Religion")

        loadReligionPlaces = localStorage.getItem('religionPlacesloaded');

        if (loadReligionPlaces == 0) {

            console.log("run Religion")

            map.data.addGeoJson(Religion_Topic); //Data is added to Gmap and then setStyle in initMap--> Circle with magnitude
            var chartData = [];
            var countPlaces;
            var countCategory = {
                "settlements": 0,
                "geographical": 0,
                "people": 0,
                "other": 0
            };

            $.each(Religion_Topic.features, function (i, item) {
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
                chartData.push([item.properties.Analysis.Religion[0], item.properties.title, item.properties.featureTypes, item.properties.timePeriodsKeys, item.properties.description]);
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
            localStorage.setItem('ReligionPlacesloaded', 1);
        }

        if (loadReligionPlaces == 1) {

            alert("Places already loaded");
        }
    });

    // on button click 
    localStorage.setItem('warReligionPlacesloaded', 0);
    $("#warReligionButton").click(function () {

        loadwarReligionPlaces = localStorage.getItem('warReligionPlacesloaded');

        if (loadwarReligionPlaces == 0) {

            console.log("run War-Religion")

            map.data.addGeoJson(War_Religion_Topic); //Data is added to Gmap and then setStyle in initMap--> Circle with magnitude
            var chartData = [];
            var countPlaces;
            var countCategory = {
                "settlements": 0,
                "geographical": 0,
                "people": 0,
                "other": 0
            };

            $.each(War_Religion_Topic.features, function (i, item) {
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
                chartData.push([item.properties.Analysis.War[0] + item.properties.Analysis.Religion[0], item.properties.title, item.properties.featureTypes, item.properties.timePeriodsKeys, item.properties.description]);
            });

            // console.log(countPlaces);
            // console.log(countCategory.settlements)
            // console.log(countCategory.geographical)
            // console.log(countCategory.people)
            // console.log(countCategory.other)


            countCategory.all = countCategory.settlements + countCategory.geographical + countCategory.people + countCategory.other;
            $(".settlements").html(countCategory.settlements);
            $(".geographical").html(countCategory.geographical);
            $(".people").html(countCategory.people);
            $(".other").html(countCategory.other);
            window.countCategory = countCategory;
            $(window).trigger('changeData', countCategory);


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


            localStorage.setItem('warReligionPlacesloaded', 1);
        }

        if (loadwarReligionPlaces == 1) {
            alert("War-Religion already loaded");
        }
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
        // var count = event.feature.getProperty("count");
        var Analysis = event.feature.getProperty('Analysis');
        try {
            var count = Analysis.Count[0]
        }
        catch (err) {
            try {
                var count = Analysis.War[0];
            }
            catch (err) {
                var count = Analysis.Religion[0];
            }
        }
        var featureTypes = event.feature.getProperty("featureTypes");
        var timePeriodsKeys = event.feature.getProperty("timePeriodsKeys");
        var maxDate = event.feature.getProperty("maxDate");
        var minDate = event.feature.getProperty("minDate");
        var description = event.feature.getProperty("description");
        var url = "https://pleiades.stoa.org/";

        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }

        try {
            var countWar = Analysis.War[0]
            var countReligion = Analysis.Religion[0]

            console.log(countWar)
            console.log(countReligion)

            infowindow.setContent(
                '<div>' +
                '<h3>' + title + '</h3>' +
                '<p></p>' +
                '<p><b>Occurences:</b> ' + 'War ' + countWar + ', Religion ' + countReligion + '<br /> ' +
                '<b>Category:</b> ' + featureTypes + '<br /> ' +
                '<b>Time Period:</b> ' + timePeriodsKeys + '<br /> ' +
                '<b>Years active A.D.:</b> ' + minDate + ' until ' + maxDate + '<br /> ' +
                '<b>Description:</b> ' + description + '<br /> ' +
                '<b>Source:</b> <a href=' + url + '>' + url + '</a> </p>' +
                '</div>'

            );
        } catch{
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
        }



        infowindow.setPosition(event.feature.getGeometry().get());
        infowindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) });
        infowindow.open(map);
    });

    map.data.setStyle(function (feature) {

        var Analysis = feature.getProperty('Analysis');

        try {
            var magnitude = Analysis.War[0] + Analysis.Religion[0]
        }
        catch{
            try {
                var magnitude = Analysis.Count[0]
            }
            catch (err) {
                try {
                    var magnitude = Analysis.War[0];
                }
                catch (err) {
                    var magnitude = Analysis.Religion[0];
                }
            }
        }

        var topic = feature.getProperty('genCategory')

        var color;

        //console.log(Analysis)

        try {
            var countWar = Analysis.War[0]
            var countReligion = Analysis.Religion[0]

            if (countWar > countReligion) {
                color = 'red'
            } else {
                color = 'white'
            }
            return {
                icon: getCircle(magnitude, color)
            }


        } catch{

            if (topic !== undefined) {
                if (topic.includes("Settlement")) {
                    color = 'green'
                } else
                    if (topic.includes("People")) {
                        color = 'green'
                    } else
                        if (topic.includes("Geographical")) {
                            color = 'purple'
                        } else
                            if (topic.includes("Other")) {
                                color = 'blue'
                            } else {
                                color = 'red'
                            }
                return {
                    icon: getCircle(magnitude, color)
                }
            } else {
                console.log("No Category Data available");
                color = 'red'
                return {
                    icon: getCircle(magnitude, color)
                }
            }

        }





    });

    //End Init Map


    function getCircle(magnitude, color) {
        var calcScale
        // calcScale = 9;
        calcScale = Math.sqrt(magnitude + 60);
        // console.log(calcScale);

        if (magnitude <= 15) {
            calcScale = magnitude * 2;
        } else {
            //console.log(magnitude)
            calcScale = 15 + ((magnitude * 2) / 30)
            //console.log(calcScale)
        }

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











