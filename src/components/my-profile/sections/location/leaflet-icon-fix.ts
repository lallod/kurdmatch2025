
import L from 'leaflet';

// Fix Leaflet's default icon issue
const fixLeafletIcon = () => {
  // Delete default icon URLs
  delete L.Icon.Default.prototype._getIconUrl;

  // Set default icon URLs manually
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

export default fixLeafletIcon;
