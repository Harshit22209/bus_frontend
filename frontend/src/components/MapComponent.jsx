import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import RoutingMachine from './RoutingMachine';
import nonSelectedIcon from './nonSelected.png';
import routes from './RoutesDB';
import axios from 'axios';

const selectedIcon = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';

const GEOCODE_URL = 'https://nominatim.openstreetmap.org/search?format=json&q=';

const MapComponent = () => {
  const [predefined, setPredefined] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [pseudoSearchResults, setPseudoSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pseudoSearchQuery, setPseudoSearchQuery] = useState('');
  const [isOptimized, setIsOptimized] = useState(false);
  const [currMarkers, setCurrMarkers] = useState([]);
  const [pseudoStops, setPseudoStops] = useState([]);
  const { type, id } = useParams();
  const [mode, setMode] = useState("");

  useEffect(() => {
    setMode(type);
    let route = [];

    routes.forEach((val) => {
      if (val.id == id) route = val;
    });

    const allUniqueMarkers = routes.reduce((acc, route) => {
      route.markers.forEach(marker => {
        if (!acc.some(existingMarker => existingMarker.id === marker.id)) {
          acc.push(marker);
        }
      });
      return acc;
    }, []);
    setMarkers(allUniqueMarkers);
    setPredefined(route.markers);
    setCurrMarkers([...route.markers]);
  }, []);

  const customIcon = (isSelected) => {
    return L.icon({
      iconUrl: isSelected ? selectedIcon : nonSelectedIcon,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      className: 'z-2000'
    });
  };

  const handleMarkerClick = (markerId) => {
    if (type === 'view') return;
    setSelectedMarkers((prev) => {
      if (prev.includes(markerId)) {
        return prev.filter((id) => id !== markerId);
      } else {
        return [...prev, markerId];
      }
    });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setSearchResults([]);
    } else {
      const filteredMarkers = markers.filter(marker =>
        marker.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setSearchResults(filteredMarkers);
    }
  };

  const handlePseudoSearch = async (e) => {
    setPseudoSearchQuery(e.target.value);
    if (e.target.value === '') {
        setPseudoSearchResults([]);
    } else {
        try {
            const response = await axios.get(`${GEOCODE_URL}${encodeURIComponent(e.target.value)}`);
            const results = response.data;

            // Filter results to include only those within India
            const indiaBounds = {
                north: 37.6,
                south: 8.1,
                east: 97.4,
                west: 68.1
            };

            const filteredResults = results.filter(result => {
                const lat = parseFloat(result.lat);
                const lon = parseFloat(result.lon);
                return lat >= indiaBounds.south && lat <= indiaBounds.north &&
                       lon >= indiaBounds.west && lon <= indiaBounds.east;
            });

            const pseudoStopsResults = filteredResults.map((result, index) => ({
                id: `pseudo-${index}`,
                name: result.display_name,
                lat: result.lat,
                lng: result.lon,
            }));

            setPseudoSearchResults(pseudoStopsResults);
        } catch (error) {
            console.error("Error fetching geocode data:", error);
        }
    }
  };

  const handleAddMarker = (markerId) => {
    let flag = false;
    currMarkers.forEach((val) => {
      if (val.id == markerId) {
        flag = true;
      }
    });

    if (!flag) setCurrMarkers((prev) => [...prev, markers.find((val) => val.id == markerId)]);
    if (!selectedMarkers.includes(markerId)) {
      setSelectedMarkers((prev) => [...prev, markerId]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleAddPseudoStop = (pseudoStop) => {
    if (pseudoStop) {
      setPseudoStops((prev) => [...prev, pseudoStop]);
      setCurrMarkers((prev) => [...prev, pseudoStop]);
      setSelectedMarkers((prev) => [...prev, pseudoStop.id]);
      setPseudoSearchQuery('');
      setPseudoSearchResults([]);
    }
  };

  const delhiCenter = [28.6139, 77.2090];

  let selectedStops = selectedMarkers.map(id =>
    currMarkers.find(marker => marker.id === id)
  );

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedStops = Array.from(selectedStops);
    const [moved] = reorderedStops.splice(result.source.index, 1);
    reorderedStops.splice(result.destination.index, 0, moved);
    setSelectedMarkers(reorderedStops.map(stop => stop.id));
  };

  return (
    <div className="flex">
      <div className="w-2/3 p-4">
        <MapContainer center={delhiCenter} zoom={11} style={{ height: '600px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {currMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={customIcon(selectedMarkers.includes(marker.id))}
              draggable={false}
              eventHandlers={{
                click: () => handleMarkerClick(marker.id),
              }}
              className='z-2000'
            >
              <Popup>{marker.name}</Popup>
              <Tooltip>{marker.name}</Tooltip>
            </Marker>
          ))}
          <RoutingMachine markers={currMarkers} predefined={predefined} selectedMarkers={selectedMarkers} optimised={[]} />
        </MapContainer>

        {mode === 'edit' && (
          <div className="mt-4">
            <h3 className="text-lg font-bold mb-2">Add Stops</h3>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search stops..."
              className="w-full p-2 mb-2 border rounded"
            />
            {searchResults.length > 0 && (
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {searchResults.map((result) => (
                  <li
                    key={result.id}
                    className="p-2 bg-gray-100 rounded-lg shadow cursor-pointer flex justify-between items-center"
                  >
                    {result.name}
                    <button
                      onClick={() => handleAddMarker(result.id)}
                      className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <h3 className="text-lg font-bold mt-4 mb-2">Add Pseudo Stops</h3>
            <input
              type="text"
              value={pseudoSearchQuery}
              onChange={handlePseudoSearch}
              placeholder="Enter pseudo stop location..."
              className="w-full p-2 mb-2 border rounded"
            />
            <ul className="space-y-2 max-h-40 overflow-y-auto mt-2">
              {pseudoSearchResults.map((result) => (
                <li
                  key={result.id}
                  className="p-2 bg-gray-100 rounded-lg shadow cursor-pointer flex justify-between items-center"
                >
                  {result.name}
                  <button
                    onClick={() => handleAddPseudoStop(result)}
                    className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="w-1/3 p-4">
      <div className="mt-4">
        <div>
          <h3 className="text-lg float-left font-bold mb-2">Predefined Stops</h3>
          <button
          onClick={() => setSelectedMarkers(predefined.map((marker)=>marker.id))}
          className="px-4 mx-10 mb-2 py-1 bg-blue-500 text-white rounded"
        >Copy</button>
        </div>
          <ul className="space-y-2">
            {predefined.map((stop) => (
              <li key={stop.id} className="p-2 bg-gray-100 rounded-lg shadow cursor-pointer">
                {stop.name}
              </li>
            ))}
          </ul>
        </div>
        <h3 className="text-lg font-bold mb-2">Selected Stops</h3>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" type="group">
            {(provided) => (
              <ul
                className="space-y-2"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {selectedStops.map((stop, index) => (
                  <Draggable key={stop.id} draggableId={stop.id.toString()} index={index}>
                    {(provided) => (
                      <li
                        className="p-2 bg-gray-100 rounded-lg shadow cursor-pointer"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {stop.name}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <button
          onClick={() => setIsOptimized((prev) => !prev)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isOptimized ? 'Disable Optimization' : 'Enable Optimization'}
        </button>

        <h3 className="text-lg font-bold mt-4 mb-2">Pseudo Stops</h3>
        <ul className="space-y-2 max-h-40 overflow-y-auto">
          {pseudoStops.map((stop) => (
            <li
              key={stop.id}
              className="p-2 bg-gray-100 rounded-lg shadow"
            >
              {stop.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MapComponent;
