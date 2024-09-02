import React from 'react';
import { Link } from 'react-router-dom';
import routes from './RoutesDB';

const RoutesList = () => {
    return (
        <div>
          <Link 
                            to={`/showRoutes`} 
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
                        >
                            Show Map
                        </Link>  
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
            {routes.map(route => (
                <div 
                    key={route.id} 
                    className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{route.name}: {route.id}</h2>
                    <div className="mb-6">
                        <ul className="space-y-2">
                            {route.markers.map(marker => (
                                <li key={marker.id} className="text-gray-600">
                                    {marker.name} - <span className="text-sm text-gray-400">({marker.lat}, {marker.lng})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex justify-between mt-4">
                        <Link 
                            to={`/view/${route.id}`} 
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
                        >
                            View
                        </Link>
                        <Link 
                            to={`/edit/${route.id}`} 
                            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300"
                        >
                            Edit
                        </Link>
                    </div>
                </div>
            ))}
        </div>
        </div>
    );
};

export default RoutesList;
