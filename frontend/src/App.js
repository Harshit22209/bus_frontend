// src/App.js
import React from 'react';
import MapComponent from './components/MapComponent';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import RoutesList from './components/RouteList';
import RouteMap from './components/RouteMap';
function App() {
  let markers = [
    { id: 1, name: 'Badarpur Border', lat: 28.5033, lng: 77.3260 },
    { id: 2, name: 'Tughlakabad', lat: 28.5023, lng: 77.2740 },
    { id: 3, name: 'Kalkaji Mandir', lat: 28.5495, lng: 77.2590 },
    { id: 4, name: 'Nehru Place', lat: 28.5483, lng: 77.2517 },
    { id: 5, name: 'AIIMS', lat: 28.5687, lng: 77.2075 },
    { id: 6, name: 'INA Market', lat: 28.5712, lng: 77.2097 },
    { id: 7, name: 'Lajpat Nagar', lat: 28.5671, lng: 77.2435 },
    { id: 8, name: 'Lodhi Colony', lat: 28.5873, lng: 77.2275 },
    { id: 9, name: 'Pragati Maidan', lat: 28.6131, lng: 77.2483 },
    { id: 10, name: 'ITO', lat: 28.6270, lng: 77.2435 },
    { id: 11, name: 'Delhi Secretariat', lat: 28.6275, lng: 77.2437 }
];

  return (
    <div>
    <BrowserRouter>
   
    <Routes>
  
      <Route path="/routes" element={<RoutesList />}  />
      <Route path="/:type/:id" element={<MapComponent />} />
      <Route path='/showRoutes' element={<RouteMap />} />
    </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
