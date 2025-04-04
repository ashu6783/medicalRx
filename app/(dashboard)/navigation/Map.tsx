"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Location {
    lat: number;
    lon: number;
    name?: string;
}

export default function Map() {
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [places, setPlaces] = useState<Location[]>([]);
    const [searchType, setSearchType] = useState("hospital");

  
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
                tags?: { name?: string };
            }

            const results = data.elements.map((element: OverpassElement) => ({
                lat: element.lat || element.center?.lat,
                lon: element.lon || element.center?.lon,
                name: element.tags?.name || "Unnamed",
            }));

            setPlaces(results);
        } catch (error) {
            console.error("Error fetching places:", error);
        }
    };

    return (
        <div className="w-full h-[500px] relative">
            {/* Search Options */}
            <div className="absolute top-4 left-4 bg-white p-2 rounded shadow-md z-10">
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="p-2 border"
                >
                    <option value="hospital">Hospitals</option>
                    <option value="pharmacy">Pharmacies</option>
                    <option value="clinic">Clinics</option>
                </select>
                <button
                    onClick={() => fetchPlaces(searchType)}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Search
                </button>
            </div>

            {/* Leaflet Map */}
            {userLocation && (
                <MapContainer center={[userLocation.lat, userLocation.lon]} zoom={13} className="h-full w-full">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {/* User Location Marker */}
                    <Marker position={[userLocation.lat, userLocation.lon]}>
                        <Popup>You are here!</Popup>
                    </Marker>

                    {/* Nearby Places Markers */}
                    {places.map((place, index) => (
                        <Marker key={index} position={[place.lat, place.lon]}>
                            <Popup>{place.name}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            )}
        </div>
    );
}
