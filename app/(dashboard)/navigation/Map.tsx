import { User,FileText,AlertCircle, Phone, AlertTriangle, MapPin, SearchCheck } from 'lucide-react';
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import FlashCard from "./FlashCard";

const customIcon = L.icon({
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = L.icon({
  iconUrl: "/marker-icon-red.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Location {
  lat: number;
  lon: number;
  name?: string;
  openingHours?: string | null;
  covidHours?: string | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  wheelchair?: string | null;
  emergency?: string | null;
  speciality?: string | null;
  operator?: string | null;
  beds?: string | null;
  insurance?: string | null;
  languages?: string | null;
}

export default function Map() {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [places, setPlaces] = useState<Location[]>([]);
  const [searchType, setSearchType] = useState("hospital");
  const [specialityFilter, setSpecialityFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchRadius, setSearchRadius] = useState(5000);
  
  // State for selected facility preview
  const [selectedFacility, setSelectedFacility] = useState<Location | null>(null);
  const [showFlashCard, setShowFlashCard] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        setError("Unable to access your location. Please check your browser permissions.");
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const fetchPlaces = async (type: string) => {
    if (!userLocation) {
      setError("Your location is required to search for nearby facilities.");
      return;
    }

    setLoading(true);
    setError(null);
    setPlaces([]);

    const overpassQuery = `
      [out:json];
      (
        node["amenity"="${type}"](around:${searchRadius}, ${userLocation.lat}, ${userLocation.lon});
        way["amenity"="${type}"](around:${searchRadius}, ${userLocation.lat}, ${userLocation.lon});
        relation["amenity"="${type}"](around:${searchRadius}, ${userLocation.lat}, ${userLocation.lon});
      );
      out center;
    `;

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    try {
      const response = await fetch(overpassUrl);

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      interface OverpassElement {
        lat?: number;
        lon?: number;
        center?: { lat: number; lon: number };
        tags?: {
          name?: string;
          opening_hours?: string;
          "opening_hours:covid19"?: string;
          "addr:street"?: string;
          "addr:housenumber"?: string;
          "addr:city"?: string;
          "addr:postcode"?: string;
          phone?: string;
          "contact:phone"?: string;
          website?: string;
          "contact:website"?: string;
          wheelchair?: string;
          emergency?: string;
          operator?: string;
          beds?: string;
          insurance?: string;
          languages?: string;
          speciality?: string;
        };
      }

      interface OverpassTags {
        name?: string;
        opening_hours?: string;
        "opening_hours:covid19"?: string;
        "addr:street"?: string;
        "addr:housenumber"?: string;
        "addr:city"?: string;
        "addr:postcode"?: string;
        phone?: string;
        "contact:phone"?: string;
        website?: string;
        "contact:website"?: string;
        wheelchair?: string;
        emergency?: string;
        operator?: string;
        beds?: string;
        insurance?: string;
        languages?: string;
        speciality?: string;
      }

      interface LocationResult {
        lat: number;
        lon: number;
        name: string;
        openingHours: string | null;
        covidHours: string | null;
        address: string | null;
        phone: string | null;
        website: string | null;
        wheelchair: string | null;
        emergency: string | null;
        speciality: string | null;
        operator: string | null;
        beds: string | null;
        insurance: string | null;
        languages: string | null;
      }

      const results: LocationResult[] = data.elements.map((element: OverpassElement) => {
        const lat = element.lat || element.center?.lat;
        const lon = element.lon || element.center?.lon;
        const tags = element.tags || {};

        const name = tags.name || "Unnamed Location";
        const openingHours = tags.opening_hours ?? null;
        const covidHours = tags["opening_hours:covid19"] ?? null;
        const phone = tags.phone || tags["contact:phone"] || null;
        const website = tags.website || tags["contact:website"] || null;
        const wheelchair = tags.wheelchair || null;
        const emergency = tags.emergency || null;
        const speciality = tags.speciality || null;
        const operator = tags.operator || null;
        const beds = tags.beds || null;
        const insurance = tags.insurance || null;
        const languages = tags.languages || null;

        const street = tags["addr:street"];
        const number = tags["addr:housenumber"];
        const city = tags["addr:city"];
        const postcode = tags["addr:postcode"];
        const address = [number, street, city, postcode].filter(Boolean).join(", ") || null;

        return {
          lat,
          lon,
          name,
          openingHours,
          covidHours,
          address,
          phone,
          website,
          wheelchair,
          emergency,
          speciality,
          operator,
          beds,
          insurance,
          languages,
        };
      }).filter((item: LocationResult) => item.lat && item.lon);

      setPlaces(results);

      if (results.length === 0) {
        setError(`No ${type}s found within ${searchRadius / 1000}km of your location. Try increasing the search radius.`);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
      setError(`Error fetching data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter displayed places by speciality if filter is active
  const filteredPlaces = specialityFilter
    ? places.filter(place =>
      place.speciality &&
      place.speciality.toLowerCase().includes(specialityFilter.toLowerCase()))
    : places;

  // Handler for opening the detail flashcard
  const handleViewDetails = (facility: Location) => {
    setSelectedFacility(facility);
    setShowFlashCard(true);
  };

  // Handler for closing the detail flashcard
  const handleCloseFlashCard = () => {
    setShowFlashCard(false);
    setSelectedFacility(null);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6">
      <div className="lg:w-1/3 w-full bg-transparent shadow-lg p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4 text-green-400">Find Nearby Healthcare</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-400 mb-1">Facility Type</label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full p-2.5 border bg-black text-white border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="hospital">Hospitals</option>
              <option value="pharmacy">Pharmacies</option>
              <option value="clinic">Clinics</option>
              <option value="doctors">Doctor&apos;s Offices</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-1">Search Radius (km)</label>
            <select
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="w-full p-2.5 border bg-black text-white border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="1000">1 km</option>
              <option value="2500">2.5 km</option>
              <option value="5000">5 km</option>
              <option value="10000">10 km</option>
              <option value="25000">25 km</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-1">Filter by Speciality</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. cardiology, pediatrics"
                value={specialityFilter}
                onChange={(e) => setSpecialityFilter(e.target.value)}
                className="w-full p-2.5 border bg-black text-white border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <button
            onClick={() => fetchPlaces(searchType)}
            disabled={loading || !userLocation}
            className={`w-full mt-2 px-4 py-3 text-black rounded-lg font-medium transition-colors flex items-center justify-center ${loading || !userLocation ? 'bg-green-400 cursor-not-allowed' : 'bg-green-400 hover:bg-green-500'
              }`}
          >
            {loading ? (
              <>
                <SearchCheck className="mr-2 animate-spin" size={18} />
                Searching...
              </>
            ) : (
              `Search Nearby ${searchType}s`
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start">
            <AlertCircle className="mr-2 flex-shrink-0 mt-0.5" size={16} />
            <span>{error}</span>
          </div>
        )}

        {!loading && filteredPlaces.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="mr-2">{filteredPlaces.length} {searchType}{filteredPlaces.length !== 1 ? 's' : ''} Found</span>
              {specialityFilter && <span className="text-xs bg-transparent blur-lg text-green-400 px-2 py-1 rounded-full">Filtered</span>}
            </h3>

            <div className="divide-y divide-green-200 max-h-96 overflow-y-auto pr-1">
              {filteredPlaces.slice(0, 10).map((place, index) => (
                <div key={index} className="py-3 first:pt-0">
                  <h4 className="font-medium text-green-500">{place.name}</h4>

                  <div className="mt-2 space-y-1.5 text-sm text-green-400">
                    {place.address && (
                      <div className="flex items-start">
                        <MapPin className="mr-2 flex-shrink-0 mt-0.5" size={16} color="#6B7280" />
                        <span>{place.address}</span>
                      </div>
                    )}

                    {place.phone && (
                      <div className="flex items-center">
                        <Phone className="mr-2 flex-shrink-0" size={16} color="#10B981" />
                        <a href={`tel:${place.phone}`} className="text-green-600 hover:underline">{place.phone}</a>
                      </div>
                    )}

                    {place.speciality && (
                      <div className="flex items-start">
                        <User className="mr-2 flex-shrink-0 mt-0.5" size={16} color="#10B981" />
                        <span className="text-green-700">Speciality: {place.speciality}</span>
                      </div>
                    )}

                    {place.emergency === "yes" && (
                      <div className="flex items-center">
                        <AlertTriangle className="mr-2 flex-shrink-0" size={16} color="#EF4444" />
                        <span className="text-red-600 font-medium">Emergency Services Available</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleViewDetails(place)}
                    className="mt-2 w-full px-3 py-1.5 bg-green-500 bg-opacity-20 text-black rounded font-medium text-sm hover:bg-opacity-30 transition-colors flex items-center justify-center"
                  >
                    <FileText size={14} className="mr-1" />
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="lg:w-2/3 z-10 w-full h-[600px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
        {userLocation ? (
          <MapContainer
            center={[userLocation.lat, userLocation.lon]}
            zoom={13}
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <Marker position={[userLocation.lat, userLocation.lon]} icon={customIcon}>
              <Popup>
                <div className="text-center font-medium">Your Location</div>
              </Popup>
            </Marker>

            {places.map((place, index) => {
              // Check if this place should be highlighted
              const isHighlighted =
                (place.speciality &&
                  specialityFilter &&
                  place.speciality.toLowerCase().includes(specialityFilter.toLowerCase())) ||
                (place.emergency && place.emergency.toLowerCase() === "yes");

              const markerIcon = isHighlighted ? redIcon : customIcon;

              return (
                <Marker key={index} position={[place.lat, place.lon]} icon={markerIcon}>
                  <Popup className="facility-popup">
                    <div className="popup-content">
                      <h3 className="text-[18px] font-bold text-green-700 mb-2">{place.name}</h3>

                      <div className="space-y-2 text-sm">
                        {place.speciality && (
                          <div className="flex items-start">
                            <User className="mr-2 flex-shrink-0 mt-0.5" size={16} color="#10B981" />
                            <span>Speciality: {place.speciality}</span>
                          </div>
                        )}

                        {place.address && (
                          <div className="flex items-start">
                            <MapPin className="mr-2 flex-shrink-0 mt-0.5" size={16} color="#6B7280" />
                            <span>{place.address}</span>
                          </div>
                        )}

                        {place.emergency && place.emergency.toLowerCase() === "yes" && (
                          <div className="flex items-start">
                            <AlertTriangle
                              className="mr-2 flex-shrink-0 mt-0.5"
                              size={16}
                              color="#EF4444"
                            />
                            <span className="text-red-600 font-medium">
                              Emergency Services Available
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleViewDetails(place)}
                        className="mt-3 w-full px-3 py-1.5 bg-green-600 text-white rounded font-medium text-sm hover:bg-green-700 transition-colors"
                      >
                        View Full Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-transparent">
            <div className="text-center p-8">
              <div className="animate-pulse mb-4 mx-auto bg-green-400 w-16 h-16 rounded-full flex items-center justify-center">
                <MapPin size={32} className="text-white" />
              </div>
              <h3 className="text-lg font-medium text-green-400 mb-2">Accessing Your Location</h3>
              <p className="text-green-300 max-w-md">
                Please allow location access to find healthcare facilities near you.
                {error && <span className="block mt-2 text-red-600 text-sm">{error}</span>}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* FlashCard component for detailed view */}
      {selectedFacility && (
        <FlashCard
          name={selectedFacility.name}
          address={selectedFacility.address}
          lat={selectedFacility.lat}
          lon={selectedFacility.lon}
          openingHours={selectedFacility.openingHours}
          covidHours={selectedFacility.covidHours}
          phone={selectedFacility.phone}
          website={selectedFacility.website}
          wheelchair={selectedFacility.wheelchair}
          emergency={selectedFacility.emergency}
          operator={selectedFacility.operator}
          beds={selectedFacility.beds}
          insurance={selectedFacility.insurance}
          languages={selectedFacility.languages}
          speciality={selectedFacility.speciality}
          isOpen={showFlashCard}
          onClose={handleCloseFlashCard}
        />
      )}
    </div>
  );
}