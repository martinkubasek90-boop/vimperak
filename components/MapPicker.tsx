"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

type Props = {
  onSelect: (lat: number, lng: number, address: string) => void;
  selectedLat?: number;
  selectedLng?: number;
};

// Vimperk center coordinates
const VIMPERK_CENTER: [number, number] = [49.0547, 13.7792];

export default function MapPicker({ onSelect, selectedLat, selectedLng }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markerRef = useRef<unknown>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix default marker icons
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!).setView(VIMPERK_CENTER, 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // If already selected position, show marker
      if (selectedLat && selectedLng) {
        const marker = L.marker([selectedLat, selectedLng], { draggable: true }).addTo(map);
        markerRef.current = marker;
        map.setView([selectedLat, selectedLng], 16);
      }

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (markerRef.current as any).setLatLng([lat, lng]);
        } else {
          const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
          markerRef.current = marker;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (marker as any).on("dragend", (ev: { target: { getLatLng: () => { lat: number; lng: number } } }) => {
            const pos = ev.target.getLatLng();
            onSelect(pos.lat, pos.lng, `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}`);
          });
        }

        onSelect(lat, lng, `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      });

      mapInstanceRef.current = map;
      setLoaded(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstanceRef.current as any).remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 rounded-xl">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <MapPin className="w-6 h-6 animate-pulse" />
            <span className="text-sm">Načítám mapu...</span>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-64 rounded-xl border border-gray-200 overflow-hidden"
        style={{ zIndex: 0 }}
      />
      <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        Klikněte na mapu pro označení místa závady
      </p>
    </div>
  );
}
