import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
interface SimpleLocationSearchProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}
const locations = [
// Kurdish cities
{ id: '1', name: 'Erbil', country: 'Kurdistan', display: 'Erbil, Kurdistan' },
{ id: '2', name: 'Sulaymaniyah', country: 'Kurdistan', display: 'Sulaymaniyah, Kurdistan' },
{ id: '3', name: 'Duhok', country: 'Kurdistan', display: 'Duhok, Kurdistan' },
{ id: '4', name: 'Kirkuk', country: 'Kurdistan', display: 'Kirkuk, Kurdistan' },
{ id: '5', name: 'Halabja', country: 'Kurdistan', display: 'Halabja, Kurdistan' },
{ id: '6', name: 'Qamishli', country: 'Kurdistan', display: 'Qamishli, Kurdistan' },
{ id: '7', name: 'Kobani', country: 'Kurdistan', display: 'Kobani, Kurdistan' },
{ id: '8', name: 'Diyarbakir', country: 'Kurdistan', display: 'Diyarbakir, Kurdistan' },
{ id: '9', name: 'Sanandaj', country: 'Kurdistan', display: 'Sanandaj, Kurdistan' },
{ id: '10', name: 'Mahabad', country: 'Kurdistan', display: 'Mahabad, Kurdistan' },

// Beach & Tropical Destinations
{ id: '100', name: 'Maldives', country: 'Maldives', display: 'Maldives' },
{ id: '101', name: 'Bora Bora', country: 'French Polynesia', display: 'Bora Bora, French Polynesia' },
{ id: '102', name: 'Seychelles', country: 'Seychelles', display: 'Seychelles' },
{ id: '103', name: 'Bali', country: 'Indonesia', display: 'Bali, Indonesia' },
{ id: '104', name: 'Maui', country: 'Hawaii', display: 'Maui, Hawaii' },
{ id: '105', name: 'Phuket', country: 'Thailand', display: 'Phuket, Thailand' },
{ id: '106', name: 'Santorini', country: 'Greece', display: 'Santorini, Greece' },
{ id: '107', name: 'Mykonos', country: 'Greece', display: 'Mykonos, Greece' },
{ id: '108', name: 'Ibiza', country: 'Spain', display: 'Ibiza, Spain' },
{ id: '109', name: 'Fiji', country: 'Fiji', display: 'Fiji' },
{ id: '110', name: 'Maldives - Baa Atoll', country: 'Maldives', display: 'Maldives – Baa Atoll' },
{ id: '111', name: 'Cancun', country: 'Mexico', display: 'Cancun, Mexico' },
{ id: '112', name: 'Turks and Caicos', country: 'Turks and Caicos', display: 'Turks and Caicos' },
{ id: '113', name: 'Mauritius', country: 'Mauritius', display: 'Mauritius' },
{ id: '114', name: 'Zanzibar', country: 'Tanzania', display: 'Zanzibar, Tanzania' },
{ id: '115', name: 'Boracay', country: 'Philippines', display: 'Boracay, Philippines' },
{ id: '116', name: 'Koh Samui', country: 'Thailand', display: 'Koh Samui, Thailand' },
{ id: '117', name: 'Palawan', country: 'Philippines', display: 'Palawan, Philippines' },
{ id: '118', name: 'Moorea', country: 'French Polynesia', display: 'Moorea, French Polynesia' },
{ id: '119', name: 'St. Lucia', country: 'St. Lucia', display: 'St. Lucia' },
{ id: '120', name: 'Tahiti', country: 'French Polynesia', display: 'Tahiti, French Polynesia' },
{ id: '121', name: 'Barbados', country: 'Barbados', display: 'Barbados' },
{ id: '122', name: 'Anguilla', country: 'Anguilla', display: 'Anguilla' },
{ id: '123', name: 'Grenada', country: 'Grenada', display: 'Grenada' },
{ id: '124', name: 'Aruba', country: 'Aruba', display: 'Aruba' },
{ id: '125', name: 'Jamaica', country: 'Jamaica', display: 'Jamaica' },
{ id: '126', name: 'Maldives - North Male Atoll', country: 'Maldives', display: 'Maldives – North Male Atoll' },
{ id: '127', name: 'Seychelles - Mahe Island', country: 'Seychelles', display: 'Seychelles – Mahe Island' },
{ id: '128', name: 'Maldives - South Male Atoll', country: 'Maldives', display: 'Maldives – South Male Atoll' },
{ id: '129', name: 'Antigua', country: 'Antigua', display: 'Antigua' },
{ id: '130', name: 'Maldives - Ari Atoll', country: 'Maldives', display: 'Maldives – Ari Atoll' },
{ id: '131', name: 'Hawaii - Oahu', country: 'Hawaii', display: 'Hawaii – Oahu' },
{ id: '132', name: 'Maldives - Lhaviyani Atoll', country: 'Maldives', display: 'Maldives – Lhaviyani Atoll' },
{ id: '133', name: 'Maldives - Raa Atoll', country: 'Maldives', display: 'Maldives – Raa Atoll' },
{ id: '134', name: 'Sardinia', country: 'Italy', display: 'Sardinia, Italy' },
{ id: '135', name: 'Corsica', country: 'France', display: 'Corsica, France' },
{ id: '136', name: 'Fiji - Mamanuca Islands', country: 'Fiji', display: 'Fiji – Mamanuca Islands' },
{ id: '137', name: 'Maldives - Addu Atoll', country: 'Maldives', display: 'Maldives – Addu Atoll' },
{ id: '138', name: 'Maldives - Dhaalu Atoll', country: 'Maldives', display: 'Maldives – Dhaalu Atoll' },

// Mountain Destinations
{ id: '200', name: 'Swiss Alps', country: 'Switzerland', display: 'Swiss Alps, Switzerland' },
{ id: '201', name: 'Rocky Mountains', country: 'USA', display: 'Rocky Mountains, USA' },
{ id: '202', name: 'Himalayas - Nepal', country: 'Nepal', display: 'Himalayas, Nepal' },
{ id: '203', name: 'Himalayas - Bhutan', country: 'Bhutan', display: 'Himalayas, Bhutan' },
{ id: '204', name: 'Himalayas - India', country: 'India', display: 'Himalayas, India' },
{ id: '205', name: 'Patagonia - Argentina', country: 'Argentina', display: 'Patagonia, Argentina' },
{ id: '206', name: 'Patagonia - Chile', country: 'Chile', display: 'Patagonia, Chile' },
{ id: '207', name: 'Dolomites', country: 'Italy', display: 'Dolomites, Italy' },
{ id: '208', name: 'Canadian Rockies', country: 'Canada', display: 'Canadian Rockies' },
{ id: '209', name: 'Kilimanjaro', country: 'Tanzania', display: 'Kilimanjaro, Tanzania' },
{ id: '210', name: 'Andes Mountains - Peru', country: 'Peru', display: 'Andes Mountains, Peru' },
{ id: '211', name: 'Andes Mountains - Chile', country: 'Chile', display: 'Andes Mountains, Chile' },
{ id: '212', name: 'Icelandic Highlands', country: 'Iceland', display: 'Icelandic Highlands' },
{ id: '213', name: 'Mount Fuji', country: 'Japan', display: 'Mount Fuji, Japan' },
{ id: '214', name: 'Mount Everest Base Camp', country: 'Nepal', display: 'Mount Everest Base Camp, Nepal' },
{ id: '215', name: 'Jungfrau Region', country: 'Switzerland', display: 'Jungfrau Region, Switzerland' },
{ id: '216', name: 'Matterhorn', country: 'Switzerland', display: 'Matterhorn, Switzerland' },
{ id: '217', name: 'Mont Blanc', country: 'France', display: 'Mont Blanc, France' },
{ id: '218', name: 'Banff National Park', country: 'Canada', display: 'Banff National Park, Canada' },
{ id: '219', name: 'Torres del Paine', country: 'Chile', display: 'Torres del Paine, Chile' },
{ id: '220', name: 'Aoraki / Mount Cook', country: 'New Zealand', display: 'Aoraki / Mount Cook, New Zealand' },
{ id: '221', name: 'Mount Rainier', country: 'USA', display: 'Mount Rainier, USA' },
{ id: '222', name: 'Dolomites - Cortina d\'Ampezzo', country: 'Italy', display: 'Dolomites – Cortina d\'Ampezzo, Italy' },
{ id: '223', name: 'Mount Etna', country: 'Italy', display: 'Mount Etna, Italy' },
{ id: '224', name: 'Pyrenees', country: 'France/Spain', display: 'Pyrenees, France/Spain' },
{ id: '225', name: 'Carpathian Mountains', country: 'Romania', display: 'Carpathian Mountains, Romania' },
{ id: '226', name: 'Atlas Mountains', country: 'Morocco', display: 'Atlas Mountains, Morocco' },
{ id: '227', name: 'Sierra Nevada', country: 'Spain', display: 'Sierra Nevada, Spain' },
{ id: '228', name: 'Himalayas - Ladakh', country: 'India', display: 'Himalayas – Ladakh, India' },
{ id: '229', name: 'Annapurna Circuit', country: 'Nepal', display: 'Annapurna Circuit, Nepal' },
{ id: '230', name: 'Mount Elbrus', country: 'Russia', display: 'Mount Elbrus, Russia' },
{ id: '231', name: 'Mount Ararat', country: 'Turkey', display: 'Mount Ararat, Turkey' },
{ id: '232', name: 'Kauai Mountains', country: 'Hawaii', display: 'Kauai Mountains, Hawaii' },
{ id: '233', name: 'Denali', country: 'Alaska', display: 'Denali, Alaska' },
{ id: '234', name: 'Yosemite National Park', country: 'USA', display: 'Yosemite National Park, USA' },
{ id: '235', name: 'Zion National Park', country: 'USA', display: 'Zion National Park, USA' },
{ id: '236', name: 'Grand Canyon', country: 'USA', display: 'Grand Canyon, USA' },
{ id: '237', name: 'Dolomites - Val Gardena', country: 'Italy', display: 'Dolomites – Val Gardena, Italy' },
{ id: '238', name: 'Banff - Lake Louise', country: 'Canada', display: 'Banff – Lake Louise, Canada' },
{ id: '239', name: 'Swiss Alps - Zermatt', country: 'Switzerland', display: 'Swiss Alps – Zermatt' },

// Historical & Cultural Sites
{ id: '300', name: 'Rome', country: 'Italy', display: 'Rome, Italy' },
{ id: '301', name: 'Athens', country: 'Greece', display: 'Athens, Greece' },
{ id: '302', name: 'Cairo / Giza', country: 'Egypt', display: 'Cairo / Giza, Egypt' },
{ id: '303', name: 'Petra', country: 'Jordan', display: 'Petra, Jordan' },
{ id: '304', name: 'Machu Picchu', country: 'Peru', display: 'Machu Picchu, Peru' },
{ id: '305', name: 'Kyoto', country: 'Japan', display: 'Kyoto, Japan' },
{ id: '306', name: 'Istanbul', country: 'Turkey', display: 'Istanbul, Turkey' },
{ id: '307', name: 'Jerusalem', country: 'Israel', display: 'Jerusalem, Israel' },
{ id: '308', name: 'Angkor Wat', country: 'Cambodia', display: 'Angkor Wat, Cambodia' },
{ id: '309', name: 'Paris', country: 'France', display: 'Paris, France' },
{ id: '310', name: 'Prague', country: 'Czech Republic', display: 'Prague, Czech Republic' },
{ id: '311', name: 'Florence', country: 'Italy', display: 'Florence, Italy' },
{ id: '312', name: 'St. Petersburg', country: 'Russia', display: 'St. Petersburg, Russia' },
{ id: '313', name: 'Luxor', country: 'Egypt', display: 'Luxor, Egypt' },
{ id: '314', name: 'Marrakech', country: 'Morocco', display: 'Marrakech, Morocco' },
{ id: '315', name: 'Beijing - Forbidden City', country: 'China', display: 'Beijing – Forbidden City, China' },
{ id: '316', name: 'Xi\'an - Terracotta Army', country: 'China', display: 'Xi\'an – Terracotta Army, China' },
{ id: '317', name: 'Jaipur', country: 'India', display: 'Jaipur, India' },
{ id: '318', name: 'Agra - Taj Mahal', country: 'India', display: 'Agra – Taj Mahal, India' },
{ id: '319', name: 'Hanoi - Old Quarter', country: 'Vietnam', display: 'Hanoi – Old Quarter, Vietnam' },
{ id: '320', name: 'Ho Chi Minh City', country: 'Vietnam', display: 'Ho Chi Minh City, Vietnam' },
{ id: '321', name: 'Dubrovnik', country: 'Croatia', display: 'Dubrovnik, Croatia' },
{ id: '322', name: 'Barcelona', country: 'Spain', display: 'Barcelona, Spain' },
{ id: '323', name: 'Seville', country: 'Spain', display: 'Seville, Spain' },
{ id: '324', name: 'Granada', country: 'Spain', display: 'Granada, Spain' },
{ id: '325', name: 'Lisbon', country: 'Portugal', display: 'Lisbon, Portugal' },
{ id: '326', name: 'Porto', country: 'Portugal', display: 'Porto, Portugal' },
{ id: '327', name: 'Vienna', country: 'Austria', display: 'Vienna, Austria' },
{ id: '328', name: 'Salzburg', country: 'Austria', display: 'Salzburg, Austria' },
{ id: '329', name: 'Budapest', country: 'Hungary', display: 'Budapest, Hungary' },
{ id: '330', name: 'Krakow', country: 'Poland', display: 'Krakow, Poland' },
{ id: '331', name: 'Warsaw', country: 'Poland', display: 'Warsaw, Poland' },
{ id: '332', name: 'Moscow', country: 'Russia', display: 'Moscow, Russia' },
{ id: '333', name: 'Tallinn', country: 'Estonia', display: 'Tallinn, Estonia' },
{ id: '334', name: 'Riga', country: 'Latvia', display: 'Riga, Latvia' },
{ id: '335', name: 'Vilnius', country: 'Lithuania', display: 'Vilnius, Lithuania' },
{ id: '336', name: 'Copenhagen', country: 'Denmark', display: 'Copenhagen, Denmark' },
{ id: '337', name: 'Oslo', country: 'Norway', display: 'Oslo, Norway' },
{ id: '338', name: 'Stockholm', country: 'Sweden', display: 'Stockholm, Sweden' },

// Urban Cities
{ id: '400', name: 'New York City', country: 'USA', display: 'New York City, USA' },
{ id: '401', name: 'Los Angeles', country: 'USA', display: 'Los Angeles, USA' },
{ id: '402', name: 'Chicago', country: 'USA', display: 'Chicago, USA' },
{ id: '403', name: 'San Francisco', country: 'USA', display: 'San Francisco, USA' },
{ id: '404', name: 'Miami', country: 'USA', display: 'Miami, USA' },
{ id: '405', name: 'Las Vegas', country: 'USA', display: 'Las Vegas, USA' },
{ id: '406', name: 'Tokyo', country: 'Japan', display: 'Tokyo, Japan' },
{ id: '407', name: 'Osaka', country: 'Japan', display: 'Osaka, Japan' },
{ id: '408', name: 'Seoul', country: 'South Korea', display: 'Seoul, South Korea' },
{ id: '409', name: 'Singapore', country: 'Singapore', display: 'Singapore' },
{ id: '410', name: 'Hong Kong', country: 'Hong Kong', display: 'Hong Kong' },
{ id: '411', name: 'Shanghai', country: 'China', display: 'Shanghai, China' },
{ id: '412', name: 'Beijing', country: 'China', display: 'Beijing, China' },
{ id: '413', name: 'Bangkok', country: 'Thailand', display: 'Bangkok, Thailand' },
{ id: '414', name: 'Dubai', country: 'UAE', display: 'Dubai, UAE' },
{ id: '415', name: 'Abu Dhabi', country: 'UAE', display: 'Abu Dhabi, UAE' },
{ id: '416', name: 'London', country: 'UK', display: 'London, UK' },
{ id: '417', name: 'Edinburgh', country: 'UK', display: 'Edinburgh, UK' },
{ id: '418', name: 'Milan', country: 'Italy', display: 'Milan, Italy' },
{ id: '419', name: 'Venice', country: 'Italy', display: 'Venice, Italy' },
{ id: '420', name: 'Madrid', country: 'Spain', display: 'Madrid, Spain' },
{ id: '421', name: 'Amsterdam', country: 'Netherlands', display: 'Amsterdam, Netherlands' },
{ id: '422', name: 'Berlin', country: 'Germany', display: 'Berlin, Germany' },
{ id: '423', name: 'Munich', country: 'Germany', display: 'Munich, Germany' },
{ id: '424', name: 'Zurich', country: 'Switzerland', display: 'Zurich, Switzerland' },
{ id: '425', name: 'Geneva', country: 'Switzerland', display: 'Geneva, Switzerland' },
{ id: '426', name: 'Cape Town', country: 'South Africa', display: 'Cape Town, South Africa' },
{ id: '427', name: 'Sydney', country: 'Australia', display: 'Sydney, Australia' },

// Nature & Wildlife
{ id: '500', name: 'Serengeti', country: 'Tanzania', display: 'Serengeti, Tanzania' },
{ id: '501', name: 'Maasai Mara', country: 'Kenya', display: 'Maasai Mara, Kenya' },
{ id: '502', name: 'Galapagos Islands', country: 'Ecuador', display: 'Galapagos Islands, Ecuador' },
{ id: '503', name: 'Yellowstone National Park', country: 'USA', display: 'Yellowstone National Park, USA' },
{ id: '504', name: 'Amazon Rainforest - Brazil', country: 'Brazil', display: 'Amazon Rainforest, Brazil' },
{ id: '505', name: 'Amazon Rainforest - Peru', country: 'Peru', display: 'Amazon Rainforest, Peru' },
{ id: '506', name: 'Kruger National Park', country: 'South Africa', display: 'Kruger National Park, South Africa' },
{ id: '507', name: 'Norwegian Fjords', country: 'Norway', display: 'Norwegian Fjords' },
{ id: '508', name: 'Iceland - Golden Circle', country: 'Iceland', display: 'Iceland – Golden Circle' },
{ id: '509', name: 'Iceland - Blue Lagoon', country: 'Iceland', display: 'Iceland – Blue Lagoon' },
{ id: '510', name: 'Madagascar', country: 'Madagascar', display: 'Madagascar' },
{ id: '511', name: 'Costa Rica Rainforests', country: 'Costa Rica', display: 'Costa Rica Rainforests' },
{ id: '512', name: 'Borneo Rainforest', country: 'Malaysia', display: 'Borneo Rainforest, Malaysia' },
{ id: '513', name: 'Komodo Island', country: 'Indonesia', display: 'Komodo Island, Indonesia' },
{ id: '514', name: 'Patagonia National Park', country: 'Chile', display: 'Patagonia National Park, Chile' },
{ id: '515', name: 'Arenal Volcano', country: 'Costa Rica', display: 'Arenal Volcano, Costa Rica' },
{ id: '516', name: 'Fiji Rainforest', country: 'Fiji', display: 'Fiji Rainforest' },
{ id: '517', name: 'Alaska - Kenai Fjords', country: 'Alaska', display: 'Alaska – Kenai Fjords' },
{ id: '518', name: 'Lapland', country: 'Finland', display: 'Lapland, Finland' },
{ id: '519', name: 'Greenland', country: 'Greenland', display: 'Greenland' },
{ id: '520', name: 'Galapagos Islands - Santa Cruz', country: 'Ecuador', display: 'Galapagos Islands – Santa Cruz' },
{ id: '521', name: 'Raja Ampat', country: 'Indonesia', display: 'Raja Ampat, Indonesia' },
{ id: '522', name: 'Faroe Islands', country: 'Faroe Islands', display: 'Faroe Islands' },
{ id: '523', name: 'Madagascar - Nosy Be', country: 'Madagascar', display: 'Madagascar – Nosy Be' },
{ id: '524', name: 'Belize Barrier Reef', country: 'Belize', display: 'Belize Barrier Reef' },
{ id: '525', name: 'Maldives - Coral Atolls', country: 'Maldives', display: 'Maldives – Coral Atolls' },

// Adventure & Ski Destinations
{ id: '600', name: 'Aspen', country: 'USA', display: 'Aspen, USA' },
{ id: '601', name: 'Vail', country: 'USA', display: 'Vail, USA' },
{ id: '602', name: 'Whistler', country: 'Canada', display: 'Whistler, Canada' },
{ id: '603', name: 'Chamonix', country: 'France', display: 'Chamonix, France' },
{ id: '604', name: 'St. Moritz', country: 'Switzerland', display: 'St. Moritz, Switzerland' },
{ id: '605', name: 'Zermatt', country: 'Switzerland', display: 'Zermatt, Switzerland' },
{ id: '606', name: 'Courchevel', country: 'France', display: 'Courchevel, France' },
{ id: '607', name: 'Verbier', country: 'Switzerland', display: 'Verbier, Switzerland' },
{ id: '608', name: 'Hokkaido', country: 'Japan', display: 'Hokkaido, Japan' },
{ id: '609', name: 'Lake Tahoe', country: 'USA', display: 'Lake Tahoe, USA' },
];
const SimpleLocationSearch = ({
  value = '',
  onChange,
  label: labelProp,
  placeholder: placeholderProp
}: SimpleLocationSearchProps) => {
  const { t } = useTranslations();
  const label = labelProp || t('profile.dream_vacation', 'Dream Vacation Destination');
  const placeholder = placeholderProp || t('profile.dream_vacation_placeholder', 'Where would you love to travel?');
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const currentValue = value || '';
  const selectedLocation = locations.find(location => location.display === currentValue);
  const filteredLocations = locations.filter(location => location.display.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleSelect = (selectedValue: string) => {
    if (onChange) {
      onChange(selectedValue === currentValue ? "" : selectedValue);
    }
    setOpen(false);
    setSearchTerm('');
  };
  return <div className="space-y-3">
      <Label className="text-white">{label}</Label>
      
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-pink-400 z-10" />
        <Button variant="outline" className="w-full justify-between pl-10 bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-purple-300 hover:bg-white/20 focus:border-pink-400 focus:ring-pink-400/20" onClick={() => setOpen(!open)}>
          <span className={selectedLocation ? "text-white" : "text-purple-300"}>
            {selectedLocation ? selectedLocation.display : placeholder}
          </span>
          <ChevronDown className={`ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform ${open ? 'rotate-180' : ''}`} />
        </Button>
        
        {open && <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 max-h-60 ">
            <div className="p-2 border-b border-gray-700">
              <input type="text" placeholder={t('profile.search_destinations', 'Search destinations...')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500" />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredLocations.length === 0 ? <div className="p-4 text-center text-gray-400">{t('profile.no_destinations', 'No destinations found.')}</div> : filteredLocations.map(location => <button key={location.id} className="w-full px-4 py-2 text-left text-white hover:bg-gray-800 flex items-center justify-between" onClick={() => handleSelect(location.display)}>
                    <div>
                      <span className="font-medium text-white">{location.name}</span>
                      <span className="text-sm text-gray-400 ml-2">{location.country}</span>
                    </div>
                    {currentValue === location.display && <Check className="h-4 w-4 text-purple-400" />}
                  </button>)}
            </div>
          </div>}
      </div>
    </div>;
};
export default SimpleLocationSearch;