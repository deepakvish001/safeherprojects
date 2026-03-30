import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const dangerZones = [
  { lat: 28.6139, lng: 77.209, radius: 500, level: "high", name: "Chandni Chowk Late Night" },
  { lat: 28.6329, lng: 77.2195, radius: 350, level: "medium", name: "Old Delhi Station Area" },
  { lat: 28.5672, lng: 77.2100, radius: 400, level: "high", name: "Sarai Kale Khan" },
];

const emergencyServices = [
  { lat: 28.6127, lng: 77.2296, type: "hospital", name: "AIIMS Hospital" },
  { lat: 28.6218, lng: 77.2149, type: "police", name: "Central Police Station" },
  { lat: 28.6304, lng: 77.2177, type: "hotel", name: "Safe Stay Hotel" },
];

const serviceIcons: Record<string, string> = {
  hospital: "🏥",
  police: "🚔",
  hotel: "🏨",
};

function LocationMarker() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 14 });
    map.on("locationfound", (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
    });
    map.on("locationerror", () => {
      // Default to New Delhi if location unavailable
      map.setView([28.6139, 77.209], 13);
    });
  }, [map]);

  return position ? (
    <Marker position={position}>
      <Popup>📍 You are here</Popup>
    </Marker>
  ) : null;
}

interface SafeMapProps {
  className?: string;
}

const SafeMap = ({ className }: SafeMapProps) => {
  return (
    <div className={className}>
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={13}
        className="w-full h-full rounded-xl"
        style={{ minHeight: "400px" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <LocationMarker />

        {dangerZones.map((zone, i) => (
          <Circle
            key={i}
            center={[zone.lat, zone.lng]}
            radius={zone.radius}
            pathOptions={{
              color: zone.level === "high" ? "#E63946" : "#F4A261",
              fillColor: zone.level === "high" ? "#E63946" : "#F4A261",
              fillOpacity: 0.2,
              weight: 2,
            }}
          >
            <Popup>
              <span className="font-bold">⚠️ {zone.name}</span>
              <br />
              Risk Level: {zone.level.toUpperCase()}
            </Popup>
          </Circle>
        ))}

        {emergencyServices.map((svc, i) => (
          <Marker
            key={i}
            position={[svc.lat, svc.lng]}
            icon={L.divIcon({
              html: `<div style="font-size:24px;text-align:center">${serviceIcons[svc.type]}</div>`,
              iconSize: [30, 30],
              className: "bg-transparent",
            })}
          >
            <Popup>{svc.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default SafeMap;
