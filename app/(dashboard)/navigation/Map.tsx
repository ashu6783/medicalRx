import { User, Bed, FileText, Globe, Clock, Trash2, Phone, AlertTriangle, Accessibility, MapPin } from 'lucide-react';
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
            },
            (error) => console.error("Error getting location:", error),
            { enableHighAccuracy: true }
        );
    }, []);

    const fetchPlaces = async (type: string) => {
        if (!userLocation) return;

        const overpassQuery = `
            [out:json];
            (
                node["amenity"="${type}"](around:5000, ${userLocation.lat}, ${userLocation.lon});
                way["amenity"="${type}"](around:5000, ${userLocation.lat}, ${userLocation.lon});
                relation["amenity"="${type}"](around:5000, ${userLocation.lat}, ${userLocation.lon});
            );
            out center;
        `;

        const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

        try {
            const response = await fetch(overpassUrl);
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

            const results = data.elements.map((element: OverpassElement) => {
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
            });

            setPlaces(results);
        } catch (error) {
            console.error("Error fetching places:", error);
        }
    };

    return (
        <div className="w-full flex flex-col lg:flex-row gap-4">
            <div className="lg:w-1/3 w-full bg-white shadow-md p-4 rounded">
                <h2 className="text-lg font-bold mb-3">Find Nearby {searchType}s</h2>

                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="hospital">Hospitals</option>
                    <option value="pharmacy">Pharmacies</option>
                    <option value="clinic">Clinics</option>
                </select>

                <label className="block mt-4 font-semibold">Filter by Speciality</label>
                <input
                    type="text"
                    placeholder="e.g. cardiology"
                    value={specialityFilter}
                    onChange={(e) => setSpecialityFilter(e.target.value.toLowerCase())}
                    className="w-full p-2 border rounded"
                />

                <button
                    onClick={() => fetchPlaces(searchType)}
                    className="w-full mt-3 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Search
                </button>

                {places.length > 0 && (
                    <div className="mt-4">
                        <h2 className="text-lg font-bold">Top 10 {searchType}s Nearby</h2>
                        <ul className="list-disc pl-5 mt-2">
                            {places.slice(0, 10).map((place, index) => (
                                <li key={index} className="mb-1">
                                    {place.name} - ({place.lat.toFixed(4)}, {place.lon.toFixed(4)})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="lg:w-2/3 w-full h-[500px] rounded overflow-hidden">
                {userLocation && (
                    <MapContainer center={[userLocation.lat, userLocation.lon]} zoom={13} className="h-full w-full">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        <Marker position={[userLocation.lat, userLocation.lon]} icon={customIcon}>
                            <Popup>You are here!</Popup>
                        </Marker>

                        {places.map((place, index) => {
                            const isHighlighted =
                                (place.speciality &&
                                    specialityFilter &&
                                    place.speciality.toLowerCase().includes(specialityFilter)) ||
                                (place.emergency && place.emergency.toLowerCase() === "yes");

                            const markerIcon = isHighlighted ? redIcon : customIcon;

                            return (
                                <Marker key={index} position={[place.lat, place.lon]} icon={markerIcon}>
                                    <Popup>
                                        <div>
                                            <strong>{place.name}</strong>
                                            <br />
                                            {place.speciality && (
                                                <>
                                                    <br />
                                                    <span className='flex items-center'>
                                                        <User className='mr-2' size={16} color="green" /> Speciality: {place.speciality}
                                                    </span>
                                                </>
                                            )}
                                            {place.operator && (
                                                <>
                                                    <br />
                                                    <span className='flex items-center'>
                                                        <User className='mr-2' size={16} color="blue" /> Operator: {place.operator}
                                                    </span>
                                                </>
                                            )}
                                            {place.beds && (
                                                <>
                                                    <br />
                                                    <span className='flex items-center'>
                                                        <Bed className='mr-2' size={16} color="orange" /> Beds: {place.beds}
                                                    </span>
                                                </>
                                            )}
                                            {place.insurance && (
                                                <>
                                                    <br />
                                                    <span className='flex items-center'>
                                                        <FileText className='mr-2' size={16} color="purple" /> Insurance: {place.insurance}
                                                    </span>
                                                </>
                                            )}
                                            {place.languages && (
                                                <>
                                                    <br />
                                                    <span className='flex items-center'>
                                                        <Globe className='mr-2' size={16} color="blue" /> Languages: {place.languages}
                                                    </span>
                                                </>
                                            )}
                                            {place.openingHours && (
                                                <>
                                                    <br />
                                                    <span className='flex items-center'>
                                                        <Clock className='mr-2' size={16} color="gray" /> Hours: {place.openingHours}
                                                    </span>
                                                </>
                                            )}
                                            {place.covidHours && (
                                                <>
                                                    <br />
                                                    <span className='flex items-center'>
                                                        <Trash2 className='mr-2' size={16} color="red" /> COVID Hours: {place.covidHours}
                                                    </span>
                                                </>
                                            )}
                                            {place.address && (
                                                <>
                                                    <br />
                                                    <span className='flex items-center'>
                                                        <MapPin className='mr-2' size={16} color="black" /> {place.address}
                                                    </span>
                                                </>
                                            )}
                                            {place.phone && (
                                                <>
                                                    <br />
                                                    <span className='flex items-center'>
                                                        <Phone className='mr-2' size={16} color="green" /> {place.phone}
                                                    </span>
                                                </>
                                            )}
                                            {place.website && (
                                                <>
                                                    <br />
                                                    <span className='flex items-center'>
                                                        <Globe className='mr-2' size={16} color="blue" />{' '}
                                                        <a href={place.website} target="_blank" className="text-blue-500">
                                                            Visit Website
                                                        </a>
                                                    </span>
                                                </>
                                            )}
                                            {place.wheelchair && (
                                                <>
                                                    <br />
                                                    <span className='flex items-center'>
                                                        <Accessibility className='mr-2' size={16} color="yellow" /> Wheelchair:{" "}
                                                        {place.wheelchair}
                                                    </span>
                                                </>
                                            )}
                                            {place.emergency && (
                                                <>
                                                    <br />
                                                    <span className='flex items-center'>
                                                        <AlertTriangle className='mr-2' size={16} color="red" />
                                                        <span>Emergency: {place.emergency}</span>
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                )}
            </div>
        </div>
    );
}
