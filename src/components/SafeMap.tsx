import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { IncidentMarker } from "@/data/incidents";
import { CATEGORIES } from "@/data/incidentTypes";

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

const severityColors: Record<string, string> = {
  low: "#94A3B8",
  medium: "#F4A261",
  high: "#E63946",
  critical: "#DC2626",
};

const severityRadius: Record<string, number> = {
  low: 150,
  medium: 250,
  high: 350,
  critical: 450,
};

interface SafeMapProps {
  className?: string;
  incidents?: IncidentMarker[];
  showIncidents?: boolean;
}

const SafeMap = ({ className, incidents = [], showIncidents = true }: SafeMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const incidentLayerRef = useRef<L.LayerGroup | null>(null);

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

    // Create incident layer group
    incidentLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstance.current = null;
      incidentLayerRef.current = null;
    };
  }, []);

  // Update incident overlays when data changes
  useEffect(() => {
    if (!incidentLayerRef.current || !showIncidents) return;

    incidentLayerRef.current.clearLayers();

    incidents.forEach((incident) => {
      const color = severityColors[incident.severity] || "#F4A261";
      const radius = severityRadius[incident.severity] || 250;
      const catInfo = CATEGORIES.find((c) => c.value === incident.category);
      const icon = catInfo?.icon || "⚠️";

      // Pulsing circle overlay
      L.circle([incident.lat, incident.lng], {
        radius,
        color,
        fillColor: color,
        fillOpacity: 0.15,
        weight: 1.5,
        dashArray: "5 5",
      })
        .addTo(incidentLayerRef.current!)
        .bindPopup(
          `<div style="min-width:160px">` +
          `<b>${icon} ${incident.title}</b><br/>` +
          `<span style="color:${color};font-weight:bold;text-transform:uppercase;font-size:11px">${incident.severity}</span>` +
          `<br/><span style="font-size:12px;color:#94A3B8">📍 ${incident.locationName}</span>` +
          `<br/><span style="font-size:11px;color:#94A3B8">👍 ${incident.upvotes} reports • ${incident.createdAt}</span>` +
          `</div>`
        );

      // Icon marker at center
      L.marker([incident.lat, incident.lng], {
        icon: L.divIcon({
          html: `<div style="font-size:18px;text-align:center;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">${icon}</div>`,
          iconSize: [24, 24],
          className: "bg-transparent",
        }),
      }).addTo(incidentLayerRef.current!);
    });
  }, [incidents, showIncidents]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-xl" style={{ minHeight: "400px" }} />
    </div>
  );
};

export default SafeMap;
