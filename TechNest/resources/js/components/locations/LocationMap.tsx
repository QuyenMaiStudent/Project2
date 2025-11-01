import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// fix markers
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

function FlyTo({ target }: { target?: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target && Array.isArray(target) && target.length === 2) {
      map.flyTo(target, 13, { duration: 0.7 });
    }
  }, [target, map]);
  return null;
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    const listener = (e: L.LeafletMouseEvent) => onClick(e.latlng.lat, e.latlng.lng);
    map.on('click', listener);
    return () => map.off('click', listener);
  }, [map, onClick]);
  return null;
}

export default function LocationMap({
  markers = [],
  target,
  onMapClick,
  center = [16.0544, 108.2022],
}: {
  markers?: { id: string; name: string; lat: number; lng: number }[];
  target?: [number, number] | null;
  onMapClick?: (lat: number, lng: number) => void;
  center?: [number, number];
}) {
  return (
    <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FlyTo target={target} />
      {markers.map(m => (
        <Marker key={m.id} position={[m.lat, m.lng]}>
          <Popup>{m.name}</Popup>
        </Marker>
      ))}
      {onMapClick && <MapClickHandler onClick={onMapClick} />}
    </MapContainer>
  );
}
