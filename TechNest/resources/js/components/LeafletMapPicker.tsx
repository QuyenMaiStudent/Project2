import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icon issue với Leaflet + Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Props {
    lat?: number;
    lng?: number;
    onLocationChange: (lat: number, lng: number, formattedAddress?: string) => void;
    height?: number;
    zoom?: number;
}

const defaultCenter: [number, number] = [21.028511, 105.804817]; // Hà Nội

// Component để handle map click events
function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onLocationChange(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

// Component để update map center khi props thay đổi
function MapUpdater({ lat, lng }: { lat?: number; lng?: number }) {
    const map = useMap();
    
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], map.getZoom());
        }
    }, [lat, lng, map]);
    
    return null;
}

const LeafletMapPicker: React.FC<Props> = ({ 
    lat, 
    lng, 
    onLocationChange, 
    height = 280, 
    zoom = 14 
}) => {
    const [position, setPosition] = useState<[number, number]>(
        lat && lng ? [lat, lng] : defaultCenter
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout>();

    // Reverse geocoding để lấy địa chỉ từ tọa độ
    const reverseGeocode = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'vi',
                    }
                }
            );
            const data = await response.json();
            return data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        }
    };

    // Handle marker drag
    const handleMarkerDrag = async (e: L.DragEndEvent) => {
        const marker = e.target;
        const position = marker.getLatLng();
        setPosition([position.lat, position.lng]);
        
        const address = await reverseGeocode(position.lat, position.lng);
        onLocationChange(position.lat, position.lng, address);
    };

    // Handle map click
    const handleMapClick = async (lat: number, lng: number) => {
        setPosition([lat, lng]);
        const address = await reverseGeocode(lat, lng);
        onLocationChange(lat, lng, address);
    };

    // Search địa điểm với Nominatim
    const searchLocation = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=vn&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'vi',
                    }
                }
            );
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Debounce search
    const handleSearchInput = (value: string) => {
        setSearchQuery(value);
        
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            searchLocation(value);
        }, 500);
    };

    // Select search result
    const selectSearchResult = (result: any) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setPosition([lat, lng]);
        onLocationChange(lat, lng, result.display_name);
        setSearchQuery('');
        setSearchResults([]);
    };

    // Update position when props change
    useEffect(() => {
        if (lat && lng) {
            setPosition([lat, lng]);
        }
    }, [lat, lng]);

    return (
        <div className="space-y-3">
            {/* Search input */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Tìm kiếm địa điểm (VD: Hoàn Kiếm, Hà Nội)..."
                    className="border rounded px-3 py-2 w-full pr-10"
                    value={searchQuery}
                    onChange={(e) => handleSearchInput(e.target.value)}
                />
                {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}
                
                {/* Search results dropdown */}
                {searchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((result, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b last:border-b-0"
                                onClick={() => selectSearchResult(result)}
                            >
                                <div className="font-medium text-sm">{result.display_name}</div>
                                <div className="text-xs text-gray-500">
                                    {result.lat}, {result.lon}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Map container */}
            <div className="rounded border overflow-hidden" style={{ height }}>
                <MapContainer
                    center={position}
                    zoom={zoom}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker 
                        position={position} 
                        draggable={true}
                        eventHandlers={{
                            dragend: handleMarkerDrag,
                        }}
                    />
                    <MapClickHandler onLocationChange={handleMapClick} />
                    <MapUpdater lat={lat} lng={lng} />
                </MapContainer>
            </div>

            {/* Coordinates display */}
            <div className="text-sm text-gray-600">
                <span className="font-medium">Tọa độ:</span> {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </div>

            {/* Instructions */}
            <div className="text-xs text-gray-500">
                💡 <strong>Hướng dẫn:</strong> Click vào bản đồ hoặc kéo marker để chọn vị trí. Sử dụng ô tìm kiếm để tìm địa điểm nhanh hơn.
            </div>
        </div>
    );
};

export default LeafletMapPicker;