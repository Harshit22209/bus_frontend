import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

const RoutingMachine = ({ markers, selectedMarkers, predefined,optimised }) => {
    const map = useMap();
    const routingControlsRef = useRef([]);
    
    useEffect(() => {
        if (!map) return;
        console.log("routing")
        console.log(selectedMarkers)
        // Get selected points in the current order
        // const selectedPoints = []
        
        function getMarker(selection){
            const selectedPoints = []
            selection.forEach((id)=>{
                selectedPoints.push(markers.filter((mark)=>{
                   return mark.id==id
                })[0])
           })
           return selectedPoints

        }
        let selectedPoints=getMarker(selectedMarkers)
        
        console.log(selectedPoints)
        
            // Clear existing routing controls
            routingControlsRef.current.forEach(control => map.removeControl(control));
            routingControlsRef.current = [];

            // Define routing based on optimization
            let routeOptions;
           
            routeOptions = [
               [selectedPoints.map((val)=>L.latLng(val.lat,val.lng)),"#125B9A"],
               [predefined.map((val)=>L.latLng(val.lat,val.lng)),'#C7253E']
            ]
       
        
            console.log(routeOptions)
            // Add each route to the map
            routeOptions.forEach((route, index) => {
                const control = L.Routing.control({
                     plan:new L.Routing.Plan(
                        route[0].map(point => L.latLng(point.lat, point.lng)),
                        {
                          routeWhileDragging: false,
                          draggableWaypoints: false,
                          addWaypoints: false, // Disable the automatic waypoint markers
                          createMarker: () => null, // Prevent creation of any additional markers
                        }),
                    routeWhileDragging: false,
                    fitSelectedRoutes: true,
                    show: false,
                    lineOptions: {
                        styles: [{ color:route[1], weight: 4,zIndex: 500 }]
                    },

                    zIndex: 1000
                }).addTo(map);

                routingControlsRef.current.push(control);
            });
            
            return () => {
                routingControlsRef.current.forEach(control => map.removeControl(control));
            };
        
    }, [map, markers, selectedMarkers,predefined,optimised]);

    return null;
};

export default RoutingMachine;
