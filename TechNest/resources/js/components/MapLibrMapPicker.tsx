import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useEffect, useRef, useState } from 'react';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ?? '';

interface Props {
    lat?: number;
    lng?: number;
    onLocationChange: (lat: number, lng: number, formattedAddress?: string) => void;
    height?: number;
    zoom?: number;
}

const defaultCenter: [number, number] = [21.028511, 105.804817];

const MapLibreMapPicker: React.FC<Props> = ({
    lat,
    lng,
    onLocationChange,
    height = 320,
    zoom = 14,
}) => {
    const initialPositionRef = useRef<[number, number]>([
        lat ?? defaultCenter[0],
        lng ?? defaultCenter[1],
    ]);
    const [position, setPosition] = useState<[number, number]>(initialPositionRef.current);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const searchTimeoutRef = useRef<number | null>(null);
    const zoomRef = useRef(zoom);
    const onLocationChangeRef = useRef(onLocationChange);

    useEffect(() => {
        zoomRef.current = zoom;
    }, [zoom]);

    useEffect(() => {
        onLocationChangeRef.current = onLocationChange;
    }, [onLocationChange]);

    const reverseGeocode = useCallback(async (latitude: number, longitude: number) => {
        if (!mapboxgl.accessToken) {
            return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        }

        try {
            const url = new URL(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`
            );
            url.search = new URLSearchParams({
                access_token: mapboxgl.accessToken,
                language: 'vi',
                limit: '1',
            }).toString();

            const response = await fetch(url.toString());
            const data = await response.json();
            return data.features?.[0]?.place_name ?? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        }
    }, []);

    const updateMarkerPosition = useCallback(
        async (latitude: number, longitude: number, formatted?: string) => {
            const current = markerRef.current?.getLngLat();
            if (
                current &&
                Math.abs(current.lat - latitude) < 1e-7 &&
                Math.abs(current.lng - longitude) < 1e-7
            ) {
                if (!formatted) {
                    formatted = await reverseGeocode(latitude, longitude);
                }
                onLocationChangeRef.current?.(latitude, longitude, formatted);
                return;
            }

            setPosition([latitude, longitude]);
            markerRef.current?.setLngLat([longitude, latitude]);
            mapRef.current?.flyTo({
                center: [longitude, latitude],
                zoom: zoomRef.current,
                essential: true,
            });

            if (!formatted) {
                formatted = await reverseGeocode(latitude, longitude);
            }

            onLocationChangeRef.current?.(latitude, longitude, formatted);
        },
        [reverseGeocode]
    );

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) {
            return;
        }

        const [initialLat, initialLng] = initialPositionRef.current;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [initialLng, initialLat],
            zoom: zoomRef.current,
            cooperativeGestures: true,
        });

        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        map.addControl(new mapboxgl.ScaleControl({ maxWidth: 110, unit: 'metric' }), 'bottom-left');
        map.on('load', () => map.resize());

        const marker = new mapboxgl.Marker({ draggable: true })
            .setLngLat([initialLng, initialLat])
            .addTo(map);

        marker.on('dragend', async () => {
            const { lat: markerLat, lng: markerLng } = marker.getLngLat();
            await updateMarkerPosition(markerLat, markerLng);
        });

        const handleMapClick = async (event: mapboxgl.MapMouseEvent) => {
            const { lat: clickedLat, lng: clickedLng } = event.lngLat;
            await updateMarkerPosition(clickedLat, clickedLng);
        };

        map.on('click', handleMapClick);

        mapRef.current = map;
        markerRef.current = marker;

        return () => {
            map.off('click', handleMapClick);
            marker.remove();
            map.remove();
            markerRef.current = null;
            mapRef.current = null;
        };
    }, [updateMarkerPosition]);

    useEffect(() => {
        if (lat != null && lng != null) {
            updateMarkerPosition(lat, lng, '');
        }
    }, [lat, lng, updateMarkerPosition]);

    const searchLocation = useCallback(
        async (query: string) => {
            if (!query.trim() || !mapboxgl.accessToken) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);

            try {
                const proximity = markerRef.current?.getLngLat();
                const params = new URLSearchParams({
                    access_token: mapboxgl.accessToken,
                    language: 'vi',
                    limit: '6',
                    country: 'VN',
                });

                if (proximity) {
                    params.set('proximity', `${proximity.lng},${proximity.lat}`);
                }

                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params.toString()}`
                );
                const data = await response.json();
                setSearchResults(data.features ?? []);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        },
        []
    );

    const handleSearchInput = (value: string) => {
        setSearchQuery(value);

        if (searchTimeoutRef.current) {
            window.clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = window.setTimeout(() => {
            searchLocation(value);
        }, 450);
    };

    const selectSearchResult = async (result: any) => {
        const latitude = result.center[1];
        const longitude = result.center[0];
        await updateMarkerPosition(latitude, longitude, result.place_name);
        setSearchQuery('');
        setSearchResults([]);
    };

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                window.clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="space-y-3">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Tìm địa điểm (VD: Hoàn Kiếm, Hà Nội)..."
                    className="w-full rounded border px-3 py-2 pr-10"
                    autoComplete="off"
                    value={searchQuery}
                    onChange={(e) => handleSearchInput(e.target.value)}
                />
                {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                    </div>
                )}
                {searchResults.length > 0 && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded border bg-white shadow">
                        {searchResults.map((result, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className="w-full border-b px-3 py-2 text-left text-sm hover:bg-gray-100 last:border-b-0"
                                onClick={() => selectSearchResult(result)}
                            >
                                <div className="font-medium">{result.place_name}</div>
                                <div className="text-xs text-gray-500">
                                    {result.center[1]}, {result.center[0]}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="rounded border" style={{ height }}>
                <div ref={mapContainerRef} className="h-full w-full" />
            </div>

            <div className="text-sm text-gray-600">
                <span className="font-medium">Tọa độ:</span> {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </div>

            <p className="text-xs text-gray-500">
                💡 Chọn vị trí bằng cách click trên bản đồ hoặc kéo marker. Sử dụng ô tìm kiếm để tra cứu nhanh.
            </p>
        </div>
    );
};

export default MapLibreMapPicker;