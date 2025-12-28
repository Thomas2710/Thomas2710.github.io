'use client';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { PlaceWithVisits } from '@/app/api/places/route';

// Fix marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ---------------------------
// Map Helpers
// ---------------------------
function SetView() {
  const map = useMap();
  useEffect(() => {
    map.setView([20, 0], 2);
    map.zoomControl.remove();
  }, [map]);
  return null;
}

function Attribution() {
  const map = useMap();
  useEffect(() => {
    map.attributionControl.addAttribution(
      '© OpenStreetMap contributors'
    );
  }, [map]);
  return null;
}

// ---------------------------
// Main Map Component
// ---------------------------
export default function WorldMap({ places }: { places: PlaceWithVisits[] }) {
  return (
    <MapContainer style={{ height: '100%', width: '100%' }}>
      <SetView />
      <Attribution />

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {places.map((place) => (
        <Marker key={place.id} position={[place.lat, place.lng]}>
          <Popup>
            <div className="font-['Press_Start_2P'] text-sm text-black">
              <strong>{place.name}</strong>

              {/* Map visits safely */}
              {(place.place_visits ?? []).map((visit) => (
                <div key={visit.id} className="mt-1">
                  <div className="text-xs text-gray-700">
                    {visit.start_date} → {visit.end_date}
                  </div>

                  {/* Map people safely */}
                  <ul className="ml-2 list-disc">
                    {(visit.place_visit_people ?? []).map((p, idx) => (
                      <li key={idx}>{p.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  );
}
