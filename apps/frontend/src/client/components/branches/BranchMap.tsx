import { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import type { Branch } from '../../../types/branch';

interface BranchMapProps {
    branches: Branch[];
    selectedBranch: Branch | null;
    setSelectedBranch: (branch: Branch) => void;
}

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = {
    lat: 10.8231, // Ho Chi Minh City
    lng: 106.6297,
};

const mapOptions = {
    styles: [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
        },
    ],
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
};

export function BranchMap({ branches, selectedBranch, setSelectedBranch }: BranchMapProps) {
    const apiKey =
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAK6yW8c6SuHdFGl3eE5Cv_bkZV_YFmtyE';

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
    });

    // Calculate center based on branches
    const center = useMemo(() => {
        if (selectedBranch && selectedBranch.latitude && selectedBranch.longitude) {
            return {
                lat: selectedBranch.latitude,
                lng: selectedBranch.longitude,
            };
        }

        const firstBranch = branches[0];
        if (branches.length > 0 && firstBranch?.latitude && firstBranch?.longitude) {
            return {
                lat: firstBranch.latitude,
                lng: firstBranch.longitude,
            };
        }

        return defaultCenter;
    }, [branches, selectedBranch]);

    if (!apiKey) {
        // Fallback UI when no API key
        return (
            <div className="w-full h-[500px] bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl shadow-xl flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="text-6xl mb-4">🗺️</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Bản đồ chi nhánh</h3>
                    <p className="text-gray-600">{branches.length} chi nhánh đang hoạt động</p>
                    {selectedBranch && (
                        <div className="mt-4 p-4 bg-white rounded-xl shadow-lg">
                            <p className="font-semibold text-gray-800">{selectedBranch.name}</p>
                            <p className="text-sm text-gray-600">{selectedBranch.address}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="w-full h-[500px] bg-red-100 rounded-3xl shadow-xl flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-red-800 mb-2">Lỗi tải bản đồ</h3>
                    <p className="text-red-600">
                        Không thể tải Google Maps. Vui lòng kiểm tra API key.
                    </p>
                </div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="w-full h-[500px] bg-gray-100 rounded-3xl shadow-xl flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="animate-spin text-6xl mb-4">⏳</div>
                    <p className="text-gray-600">Đang tải bản đồ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-xl">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={selectedBranch ? 15 : 12}
                options={mapOptions}
            >
                {branches.map((branch) => {
                    if (!branch.latitude || !branch.longitude) return null;

                    const isSelected = selectedBranch?.id === branch.id;

                    // Create custom pin marker icon as SVG
                    const markerIcon = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="${isSelected ? 40 : 32}" height="${isSelected ? 50 : 40}" viewBox="0 0 32 40">
                                <path d="M16 0C9.4 0 4 5.4 4 12c0 8 12 28 12 28s12-20 12-28c0-6.6-5.4-12-12-12z"
                                      fill="${isSelected ? '#ec4899' : '#9333ea'}"
                                      stroke="#ffffff"
                                      stroke-width="2"/>
                                <circle cx="16" cy="12" r="4" fill="#ffffff"/>
                            </svg>
                        `)}`;

                    return (
                        <Marker
                            key={branch.id}
                            position={{
                                lat: branch.latitude,
                                lng: branch.longitude,
                            }}
                            onClick={() => setSelectedBranch(branch)}
                            icon={markerIcon}
                        />
                    );
                })}

                {selectedBranch && selectedBranch.latitude && selectedBranch.longitude && (
                    <InfoWindow
                        position={{
                            lat: selectedBranch.latitude,
                            lng: selectedBranch.longitude,
                        }}
                        onCloseClick={() => {}}
                    >
                        <div className="p-2 max-w-xs">
                            <h3 className="font-bold text-gray-900 mb-1">{selectedBranch.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{selectedBranch.address}</p>
                            {selectedBranch.phone && (
                                <p className="text-sm text-gray-600">📞 {selectedBranch.phone}</p>
                            )}
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
}
