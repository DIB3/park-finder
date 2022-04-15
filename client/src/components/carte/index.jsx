import React, { useEffect } from 'react'
import NavigationBar from './navigation-barre'
import { auth, db } from '../../firebase'
import { useHistory } from 'react-router-dom'
import '../../css/carte.css'




export default function Index() {

    let history = useHistory()

    auth.onAuthStateChanged((user) => {
        if(user == null){
            history.push('/login')
        }
    })

    useEffect(() => {
        let body = document.body
        body.classList.remove('BackgroundStyle')


        var geojson = {}

    
        // require
        var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
        
        var MapboxDirections = require('@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions');
        // var MapboxDirections = require('mapbox-gl/dist/');

        navigator.geolocation.getCurrentPosition( successLocation, errorLocation, { enableHighAccuracy: true })   

        //functions
        function successLocation(position){
            
            setUpMap([ position.coords.longitude, position.coords.latitude])

        }
        
        function errorLocation(){
            setUpMap([-7.603869, 33.589886])
        }

        function setUpMap(center){
            mapboxgl.accessToken = 'pk.eyJ1IjoiZWxtZWhkaXllc3NhZCIsImEiOiJja3B5OGVwaG4wNDBtMnBvOHh0NHQ5MGFyIn0.yR3fLdRcqMlJG_mT8PU2dw';
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: center,
                zoom: 11
            });
            var  geolocate
            var userlong
            var userlat 
            map.addControl(

                geolocate =  new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true 
                })
            );  
            
        
            
              map.addControl(
                new MapboxDirections({
                accessToken: mapboxgl.accessToken,
                unit: 'metric',
                instructions: true,   
                placeholderOrigin:"find ur position " ,     
                profile: 'mapbox/driving-traffic',
                controls: {
                    profileSwitcher: true,
                    inputs: true,
                    instructions: false
                  },
                  
                }),
                'top-left'
                
                );
            
                
            // Add directions
           //map.addControl(directions);
            // Add zoom and rotation controls to the map.
            map.addControl(new mapboxgl.NavigationControl());


            // get Data from firestore collection parkings in order to show Marker's location
            var table = []
            db.collection("parkings").get().then((querySnapshot) => {
                var objectToPush = {}
                querySnapshot.forEach((doc) => {
                    // console.log(" => ", doc.data().localisation.latitude)
                    // console.log(" => ", doc.data().localisation.longitude)
                    
                    // table.push(doc.data().localisation)
                    objectToPush = {localisation: doc.data().localisation, name: doc.data().name, adresse: doc.data().adresse, placesFree: doc.data().npl}
                    table.push(objectToPush)
                });
                
            }).then(() => {
                var featuresArray = []
                var FeatureToPush = {}
                if(table.length > 0){
                    
                    for(var i = 0; i < table.length; i++) {
                        // traitement
                        FeatureToPush = {
                                type: 'Feature',
                                geometry: {
                                type: 'Point',
                                coordinates: [table[i].localisation._long, table[i].localisation._lat]
                                },
                                properties: {
                                title: table[i].name,
                                description: table[i].adresse,
                                placesFree: table[i].placesFree
                                }
                            }
                        
                        featuresArray.push(FeatureToPush)
                        // console.log('table '+i, table[i]._lat)
                        // console.log('table '+i, table[i]._long)
                        
                    }
                }
                console.log('Table : ', table)
                console.log("featuresArray", featuresArray)
                // object that contain long, lat of the parkings *********
                geojson = {
                    type: 'FeatureCollection',
                    features: featuresArray
                };

                // add markers to map
                geojson.features.forEach(function(marker) {
                    // create a HTML element for each feature / retrieve the div
                    var el = document.createElement('div')
                    el.className = 'markerStyle'

                    // make a marker for each feature and add to the map
                    new mapboxgl.Marker(el)
                    .setLngLat(marker.geometry.coordinates)
                    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        '<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'+ 'Free places ' + marker.properties.placesFree + '</p>'
                    ))
                    .addTo(map)
                });
            })

            
            // https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/
        }

    });

    
    const handleMapsStyle = {
        height: "100vh",
        width: "100vw"
    }

    return (
        <div>
            <script src='https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.js'></script>
            <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.0/mapbox-gl-directions.css" type="text/css"></link>
            <div id="map" style={handleMapsStyle}></div>
            <NavigationBar />

        </div>
    )
}

