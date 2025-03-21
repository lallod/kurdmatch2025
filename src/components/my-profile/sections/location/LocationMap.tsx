
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import fixLeafletIcon from './leaflet-icon-fix';

interface LocationMapProps {
  position: [number, number];
  onClick?: (lat: number, lng: number) => void;
  height?: string;
  width?: string;
  zoom?: number;
}

// This component allows us to update the center of the map when position changes
const MapUpdater: React.FC<{ position: [number, number]; zoom: number }> = ({ position, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(position, zoom);
  }, [map, position, zoom]);
  
  return null;
};

// This component handles map clicks and reports coordinates
const MapClicker: React.FC<{ onClick?: (lat: number, lng: number) => void }> = ({ onClick }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!onClick) return;
    
    const handleClick = (e: any) => {
      const { lat, lng } = e.latlng;
      onClick(lat, lng);
    };
    
    map.on('click', handleClick);
    
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onClick]);
  
  return null;
};

const LocationMap: React.FC<LocationMapProps> = ({ 
  position, 
  onClick,
  height = '300px',
  width = '100%',
  zoom = 5
}) => {
  // Fix Leaflet icon issue on load
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  return (
    <div className="rounded-md overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        style={{ height, width }}
        // Instead of directly setting center and zoom on MapContainer,
        // we'll use the MapUpdater component to set these values
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
        <MapUpdater position={position} zoom={zoom} />
        <MapClicker onClick={onClick} />
      </MapContainer>
    </div>
  );
};

export default LocationMap;
