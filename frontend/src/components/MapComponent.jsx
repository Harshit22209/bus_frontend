
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import RoutingMachine from './RoutingMachine';
// Import your marker icons here
import nonSelectedIcon from './nonSelected.png';
import routes from './RoutesDB'

const selectedIcon = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const MapComponent = () => {
  const [predefined,setPredefined]=useState([])
  const [markers,setMarkers]=useState([])
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const [optimisedSeq,setOptimisedSeq]=useState([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const { type, id } = useParams();
  const [mode,setMode]=useState("")

  useEffect(()=>{
    
    setMode(type)
    let route=[]

    routes.forEach((val)=>{
      if(val.id==id) route=val
    })
    console.log(route)
    const allUniqueMarkers = routes.reduce((acc, route) => {
        route.markers.forEach(marker => {
            if (!acc.some(existingMarker => existingMarker.id === marker.id)) {
                acc.push(marker);
            }
        });
        return acc;
    }, []);
    setMarkers(allUniqueMarkers)
    setPredefined(route.markers)
  },[])
  const customIcon = (isSelected) => {
    return L.icon({
      iconUrl: isSelected ? selectedIcon : nonSelectedIcon,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
       className:'z-2000'
    });
  };

  const handleMarkerClick = (markerId) => {
    if(type=='view') return []
    console.log(markerId)
    setSelectedMarkers((prev) => {
      if (prev.includes(markerId)) {
        return prev.filter((id) => id !== markerId);
      } else {
        return [...prev, markerId];
      }
    });
    
  };

  // Center the map on Delhi
  const delhiCenter = [28.6139, 77.2090];

  // Get the selected stops in order
  let selectedStops=[]
  selectedMarkers.forEach((id)=>{
    selectedStops.push(markers.filter((mark)=>{
       return mark.id==id
    })[0])
})

  // Handle drag end
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedStops = Array.from(selectedStops);
    const [moved] = reorderedStops.splice(result.source.index, 1);
    reorderedStops.splice(result.destination.index, 0, moved);
    console.log()
    console.log(reorderedStops)
    selectedStops=reorderedStops
    setSelectedMarkers(reorderedStops.map(stop => stop.id));
    // setOrderedMarkers(reorderedStops)
  };

  return (
    <div className="flex">
      <MapContainer center={delhiCenter} zoom={11} style={{ height: '600px', width: '70%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker) => (
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
          </Marker>
        ))}
        <RoutingMachine markers={markers} predefined={predefined} selectedMarkers={selectedMarkers} optimised={optimisedSeq} />
      </MapContainer>
      <div className="w-1/3 p-4">
      <h3 className="text-lg font-bold mb-2">Predefined Stops</h3>
       
           
              <ul
                className="space-y-2"
                
              >
                {predefined.map((stop, index) => (
                  
                      <li
                        className="p-2 bg-gray-100 rounded-lg shadow cursor-pointer"
                
                       
                      >
                        {stop.name}
                      </li>
                    ))}
                 
              {console.log('yo'+type)}
              </ul>

        {mode==='edit' &&
        <div>

        <h3 className="text-lg font-bold mb-2">Selected Stops</h3>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={"droppable"} type="group">
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
        </div> }
       
      </div>
    </div>
  );
};


export default MapComponent;