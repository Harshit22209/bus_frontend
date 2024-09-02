import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

const RoutingMachine = ({ markers = [], selectedMarkers = [], predefined = [], optimized = [] }) => {
    const map = useMap();
    const routingControlsRef = useRef([]);

    useEffect(() => {
        if (!map) return;

        // Function to get markers by IDs
        function getMarkersByIds(ids) {
            return ids.map(id => markers.find(marker => marker.id === id)).filter(Boolean);
        }
        try{
        // Get selected points and pseudo stops
        const selectedPoints = getMarkersByIds(selectedMarkers);
        // const pseudoPoints = pseudoStops.map(stop => ({ ...stop, id: `pseudo-${stop.id}` }));
        console.log(routingControlsRef.current)
        // Clear existing routing controls
        routingControlsRef.current.forEach((control) => {        
        
                console.log(1)
                control.remove()
            
                console.log("to")
                   
        });
        // if (routingControlsRef.current) {
        //     // map.removeControl(routingControlsRef.current);  
        //     map.removeControl(routingControlsRef.current)
        // }

       
        console.log("hi")
        // Define routing based on optimization
        const routeOptions = [
            [selectedPoints.map(point => L.latLng(point.lat, point.lng)), "#125B9A",6,600],
            [predefined.map(point => L.latLng(point.lat, point.lng)), '#C7253E',2,550],
           
        ];
        // routingControlsRef.current.forEach((control)=>{
        //     map.remove(control)
        // })
        // routingControlsRef.current=[]
        // Add each route to the map
        routeOptions.forEach((route, index) => {
            if (route[0].length <2) return; // Skip if route array is empty
        
            const control = L.Routing.control({
                plan: new L.Routing.Plan(
                    route[0],
                    {
                        routeWhileDragging: true,
                        draggableWaypoints: false,
                        addWaypoints: true, // Disable the automatic waypoint markers
                        createMarker: () => null, // Prevent creation of any additional markers
                    }
                ),
                routeWhileDragging: true,
                fitSelectedRoutes: true,
                show: false,
                lineOptions: {
                    styles: [{ color: route[1], weight: route[2], zIndex: route[3] }]
                },
                zIndex: 1000
            }).addTo(map);
        
            routingControlsRef.current.push(control);

        
        });
        
        console.log("bro")

        return () => {
            // Cleanup routing controls
        //     try{
        //         // console.log(2)
        //     routingControlsRef.current.forEach(control => {
                
        //         if (map && control) {
        //             map.removeControl(control);
        //         }
        //     });
        //     routingControlsRef.current = [];
        // } catch(error){
        //     console.log(error)
        // }
        routingControlsRef.current.forEach((control) => {
            if (control) {
                control.remove()
            }
        });
       
        };
    }catch(error){
        console.log(error)
    }
    }, [map, markers, selectedMarkers, predefined]);

    return null;
};

export default RoutingMachine;
