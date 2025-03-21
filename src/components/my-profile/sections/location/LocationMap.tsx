
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import fixLeafletIcon from './leaflet-icon-fix';

// Component to handle map events
const MapEvents = ({ onClick }: { onClick: (e: any) => void }) => {
  useMapEvents({
    click: onClick,
  });
  return null;
};

// Component to handle changing the map view
const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

interface LocationMapProps {
  position: [number, number];
  onClick: (lat: number, lng: number) => void;
  zoom?: number;
  height?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({
  position,
  onClick,
  zoom = 3,
  height = '300px'
}) => {
  // Fix Leaflet default icon issue
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng;
    onClick(lat, lng);
  };

  return (
    <div className="w-full rounded-md border border-input overflow-hidden" style={{ height }}>
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={position} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
        <MapEvents onClick={handleMapClick} />
      </MapContainer>
    </div>
  );
};

export default LocationMap;
