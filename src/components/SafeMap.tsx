import { useEffect, useRef } from "react";
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
  { lat: 28.5672, lng: 77.21, radius: 400, level: "high", name: "Sarai Kale Khan" },
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

interface SafeMapProps {
  className?: string;
}

const SafeMap = ({ className }: SafeMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, { zoomControl: false }).setView([28.6139, 77.209], 13);
    mapInstance.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(map);

    // User location
    map.locate({ setView: true, maxZoom: 14 });
    map.on("locationfound", (e) => {
      L.marker(e.latlng).addTo(map).bindPopup("📍 You are here");
    });

    // Danger zones
    dangerZones.forEach((zone) => {
      L.circle([zone.lat, zone.lng], {
        radius: zone.radius,
        color: zone.level === "high" ? "#E63946" : "#F4A261",
        fillColor: zone.level === "high" ? "#E63946" : "#F4A261",
        fillOpacity: 0.2,
        weight: 2,
      })
        .addTo(map)
        .bindPopup(`<b>⚠️ ${zone.name}</b><br/>Risk: ${zone.level.toUpperCase()}`);
    });

    // Emergency services
    emergencyServices.forEach((svc) => {
      L.marker([svc.lat, svc.lng], {
        icon: L.divIcon({
          html: `<div style="font-size:24px;text-align:center">${serviceIcons[svc.type]}</div>`,
          iconSize: [30, 30],
          className: "bg-transparent",
        }),
      })
        .addTo(map)
        .bindPopup(svc.name);
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-xl" style={{ minHeight: "400px" }} />
    </div>
  );
};

export default SafeMap;
