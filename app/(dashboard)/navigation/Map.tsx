"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom Leaflet Marker Icon
const customIcon = L.icon({
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Location Interface
interface Location {
    lat: number;
    lon: number;
    name?: string;
}

export default function Map() {
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [places, setPlaces] = useState<Location[]>([]);
    const [searchType, setSearchType] = useState("hospital");

    // Get User's Current Location
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

    // Fetch Nearby Places using Overpass API
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
                tags?: { name?: string };
            }

            const results = data.elements.map((element: OverpassElement) => ({
                lat: element.lat || element.center?.lat,
                lon: element.lon || element.center?.lon,
                name: element.tags?.name || "Unnamed Location",
            }));

            setPlaces(results);
        } catch (error) {
            console.error("Error fetching places:", error);
        }
    };

    return (
        <div className="w-full flex flex-col lg:flex-row gap-4">
            {/* Left Panel: Search & List of Places */}
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
                <button
                    onClick={() => fetchPlaces(searchType)}
                    className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Search
                </button>

                {/* List of Top 10 Nearby Places */}
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

            {/* Right Panel: Map */}
            <div className="lg:w-2/3 w-full h-[500px] rounded overflow-hidden">
                {userLocation && (
                    <MapContainer center={[userLocation.lat, userLocation.lon]} zoom={13} className="h-full w-full">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {/* User Location Marker */}
                        <Marker position={[userLocation.lat, userLocation.lon]} icon={customIcon}>
                            <Popup>You are here!</Popup>
                        </Marker>

                        {/* Nearby Places Markers */}
                        {places.map((place, index) => (
                            <Marker key={index} position={[place.lat, place.lon]} icon={customIcon}>
                                <Popup>{place.name}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>
        </div>
    );
}
