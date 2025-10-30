import { useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
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
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

    // Calculate center based on branches
    const center = useCallback(() => {
        if (selectedBranch && selectedBranch.latitude && selectedBranch.longitude) {
            return {
                lat: selectedBranch.latitude,
                lng: selectedBranch.longitude,
            };
        }

        if (branches.length > 0 && branches[0].latitude && branches[0].longitude) {
            return {
                lat: branches[0].latitude,
                lng: branches[0].longitude,
            };
        }

        return defaultCenter;
    }, [branches, selectedBranch]);

    if (!apiKey) {
        // Fallback UI when no API key
        return (
            <div className='w-full h-[500px] bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl shadow-xl flex items-center justify-center'>
                <div className='text-center p-8'>
                    <div className='text-6xl mb-4'>🗺️</div>
                    <h3 className='text-xl font-bold text-gray-800 mb-2'>Bản đồ chi nhánh</h3>
                    <p className='text-gray-600'>
                        {branches.length} chi nhánh đang hoạt động
                    </p>
                    {selectedBranch && (
                        <div className='mt-4 p-4 bg-white rounded-xl shadow-lg'>
                            <p className='font-semibold text-gray-800'>{selectedBranch.name}</p>
                            <p className='text-sm text-gray-600'>{selectedBranch.address}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className='w-full h-[500px] rounded-3xl overflow-hidden shadow-xl'>
            <LoadScript googleMapsApiKey={apiKey}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center()}
                    zoom={selectedBranch ? 15 : 12}
                    options={mapOptions}
                >
                    {branches.map((branch) => {
                        if (!branch.latitude || !branch.longitude) return null;

                        return (
                            <Marker
                                key={branch.id}
                                position={{
                                    lat: branch.latitude,
                                    lng: branch.longitude,
                                }}
                                onClick={() => setSelectedBranch(branch)}
                                icon={{
                                    path: window.google.maps.SymbolPath.CIRCLE,
                                    scale: selectedBranch?.id === branch.id ? 12 : 8,
                                    fillColor: selectedBranch?.id === branch.id ? '#ec4899' : '#9333ea',
                                    fillOpacity: 1,
                                    strokeColor: '#ffffff',
                                    strokeWeight: 2,
                                }}
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
                            <div className='p-2 max-w-xs'>
                                <h3 className='font-bold text-gray-900 mb-1'>{selectedBranch.name}</h3>
                                <p className='text-sm text-gray-600 mb-2'>{selectedBranch.address}</p>
                                {selectedBranch.phone && (
                                    <p className='text-sm text-gray-600'>
                                        📞 {selectedBranch.phone}
                                    </p>
                                )}
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
