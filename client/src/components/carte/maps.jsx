import React, { useEffect } from 'react'

export default function Index() {

    useEffect(() => {
        var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
        mapboxgl.accessToken = 'pk.eyJ1IjoiZWxtZWhkaXllc3NhZCIsImEiOiJja3B5OGVwaG4wNDBtMnBvOHh0NHQ5MGFyIn0.yR3fLdRcqMlJG_mT8PU2dw';
        var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11'
        });
    })
    
    
    return (
        <>
            <div id="map"></div>
        </>
    )
    

    
}
