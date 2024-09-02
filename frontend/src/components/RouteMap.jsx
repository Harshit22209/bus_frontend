import React from 'react'

const RouteMap = () => {
  return (
    <div>RouteMap</div>
  )
}

export default RouteMap
// import React, { useState, useEffect, useRef } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet-routing-machine';
// import L from 'leaflet';
// import routes from './RoutesDB'; // Assuming your routes are in this file
// import { useMap } from 'react-leaflet';
// const RouteMap = () => {
//     const [selectedRoutes, setSelectedRoutes] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);

//     const routesPerPage = 10;
//     const mapRef = useRef(null);
//     const routingControlRef = useRef({});

//     const handleCheckboxChange = (routeId) => {
//         console.log(routeId)
//         setSelectedRoutes(prevSelectedRoutes => {
//             if (prevSelectedRoutes.includes(routeId)) {
//                 // Remove the route from the map
//                 routingControlRef.current[routeId]?.remove();
//                 delete routingControlRef.current[routeId];
//                 return prevSelectedRoutes.filter(id => id !== routeId);
//             } else {
//                 return [...prevSelectedRoutes, routeId];
//             }
//         });
//     };
//     const addMarkers=(markerId) => {
        
//         setSelectedMarkers((prev) => {
//           if (prev.includes(markerId)) {
//             return prev.filter((id) => id !== markerId);
//           } else {
//             return [...prev, markerId];
//           }
//         });
//     };
//     const MapRouting = ({ selectedRoutes}) => {
//         const map = useMap();
//         const routingControlsRef = useRef([]);
    
//         useEffect(() => {
//             if (!map) return;
    
//             // Function to get markers by IDs
//             function getMarkersByIds(ids) {
//                 return ids.map(id => markers.find(marker => marker.id === id)).filter(Boolean);
//             }
//             try{
//             // Get selected points and pseudo stops
//             const selectedPoints = getMarkersByIds(selectedMarkers);
//             // const pseudoPoints = pseudoStops.map(stop => ({ ...stop, id: `pseudo-${stop.id}` }));
//             console.log(routingControlsRef.current)
//             // Clear existing routing controls
//             routingControlsRef.current.forEach((control) => {        
            
//                     console.log(1)
//                     control.remove()
                
//                     console.log("to")
                       
//             });
//             // if (routingControlsRef.current) {
//             //     // map.removeControl(routingControlsRef.current);  
//             //     map.removeControl(routingControlsRef.current)
//             // }
    
           
//             console.log("hi")
//             // Define routing based on optimization
//             const routeOptions = [
//                 [selectedPoints.map(point => L.latLng(point.lat, point.lng)), "#125B9A",6,600],
//                 [predefined.map(point => L.latLng(point.lat, point.lng)), '#C7253E',2,550],
               
//             ];
//             // routingControlsRef.current.forEach((control)=>{
//             //     map.remove(control)
//             // })
//             // routingControlsRef.current=[]
//             // Add each route to the map
//             routeOptions.forEach((route, index) => {
//                 if (route[0].length <2) return; // Skip if route array is empty
            
//                 const control = L.Routing.control({
//                     plan: new L.Routing.Plan(
//                         route[0],
//                         {
//                             routeWhileDragging: true,
//                             draggableWaypoints: false,
//                             addWaypoints: true, // Disable the automatic waypoint markers
//                             createMarker: () => null, // Prevent creation of any additional markers
//                         }
//                     ),
//                     routeWhileDragging: true,
//                     fitSelectedRoutes: true,
//                     show: false,
//                     lineOptions: {
//                         styles: [{ color: route[1], weight: route[2], zIndex: route[3] }]
//                     },
//                     zIndex: 1000
//                 }).addTo(map);
            
//                 routingControlsRef.current.push(control);
    
            
//             });
            
//             console.log("bro")
    
//             return () => {
//                 // Cleanup routing controls
//             //     try{
//             //         // console.log(2)
//             //     routingControlsRef.current.forEach(control => {
                    
//             //         if (map && control) {
//             //             map.removeControl(control);
//             //         }
//             //     });
//             //     routingControlsRef.current = [];
//             // } catch(error){
//             //     console.log(error)
//             // }
//             routingControlsRef.current.forEach((control) => {
//                 if (control) {
//                     control.remove()
//                 }
//             });
           
//             };
//         }catch(error){
//             console.log(error)
//         }
//         }, [map, markers, selectedMarkers, predefined]);
    
//         return null;
//     };
    

//     const getRandomColor = () => {
//         return '#' + Math.floor(Math.random() * 16777215).toString(16);
//     };

//     const totalPages = Math.ceil(routes.length / routesPerPage);

//     const paginateRoutes = (routes, currentPage) => {
//         const startIndex = (currentPage - 1) * routesPerPage;
//         const endIndex = startIndex + routesPerPage;
//         return routes.slice(startIndex, endIndex);
//     };

//     const handlePageChange = (newPage) => {
//         if (newPage > 0 && newPage <= totalPages) {
//             setCurrentPage(newPage);
//         }
//     };

//     return (
//         <div style={{ display: 'flex' }}>
//             <div style={{ width: '70%' }}>
//                 <MapContainer
//                     center={[28.6139, 77.2090]}
//                     zoom={12}
//                     style={{ height: '100vh', width: '100%' }}
//                     whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
//                 >
//                     <TileLayer
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                         attribution="&copy; OpenStreetMap contributors"
//                     />
//                     <MapRouting selectedRoutes={selectedRoutes}/>
//                 </MapContainer>
//             </div>
//             <div style={{ width: '30%', padding: '20px', overflowY: 'scroll', height: '100vh', backgroundColor: '#f8f9fa' }}>
//                 {paginateRoutes(routes, currentPage).map(route => (
//                     <div key={route.id} style={{ marginBottom: '10px' }}>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedRoutes.includes(route.id)}
//                                 onChange={() => handleCheckboxChange(route.id)}
//                             />
//                             {route.name}
//                         </label>
//                     </div>
//                 ))}
//                 <div style={{ marginTop: '20px', textAlign: 'center' }}>
//                     <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
//                         Previous
//                     </button>
//                     <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
//                     <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
//                         Next
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RouteMap;
