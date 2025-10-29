import React, { useEffect, useRef, createElement } from 'react';
export function BranchMap({ branches, selectedBranch, setSelectedBranch }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    useEffect(() => {
        // This is a placeholder for Google Maps integration
        // In a real implementation, you would use the Google Maps API
        const renderMap = () => {
            const mapElement = mapRef.current;
            if (mapElement) {
                // Create a simple placeholder map
                mapElement.innerHTML = '';
                mapElement.style.position = 'relative';
                mapElement.style.overflow = 'hidden';
                // Create map background
                const mapBackground = document.createElement('div');
                mapBackground.style.position = 'absolute';
                mapBackground.style.inset = '0';
                mapBackground.style.backgroundColor = '#f0f4f8';
                mapBackground.style.backgroundImage = 'radial-gradient(circle, #ffffff 1px, transparent 1px)';
                mapBackground.style.backgroundSize = '20px 20px';
                mapElement.appendChild(mapBackground);
                // Add a map-like grid
                const gridLines = document.createElement('div');
                gridLines.style.position = 'absolute';
                gridLines.style.inset = '0';
                gridLines.style.backgroundImage =
                    'linear-gradient(to right, rgba(200, 200, 200, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(200, 200, 200, 0.1) 1px, transparent 1px)';
                gridLines.style.backgroundSize = '50px 50px';
                mapElement.appendChild(gridLines);
                // Add location markers
                branches.forEach((branch, index) => {
                    const marker = document.createElement('div');
                    marker.style.position = 'absolute';
                    marker.style.left = `${10 + index * 20}%`;
                    marker.style.top = `${20 + index * 15}%`;
                    marker.style.width = '20px';
                    marker.style.height = '20px';
                    marker.style.borderRadius = '50%';
                    marker.style.backgroundColor = selectedBranch?.id === branch.id ? '#ec4899' : '#9333ea';
                    marker.style.border = '2px solid white';
                    marker.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                    marker.style.transform = selectedBranch?.id === branch.id ? 'scale(1.5)' : 'scale(1)';
                    marker.style.transition = 'all 0.3s ease';
                    marker.style.cursor = 'pointer';
                    marker.title = branch.name;
                    marker.addEventListener('click', () => setSelectedBranch(branch));
                    // Add label
                    const label = document.createElement('div');
                    label.style.position = 'absolute';
                    label.style.top = '24px';
                    label.style.left = '50%';
                    label.style.transform = 'translateX(-50%)';
                    label.style.backgroundColor = 'white';
                    label.style.padding = '4px 8px';
                    label.style.borderRadius = '4px';
                    label.style.fontSize = '12px';
                    label.style.fontWeight = 'bold';
                    label.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    label.style.whiteSpace = 'nowrap';
                    label.textContent = branch.name;
                    marker.appendChild(label);
                    mapElement.appendChild(marker);
                    markersRef.current.push(marker);
                });
                // Add map controls (for visual effect only)
                const controls = document.createElement('div');
                controls.style.position = 'absolute';
                controls.style.top = '10px';
                controls.style.right = '10px';
                controls.style.display = 'flex';
                controls.style.flexDirection = 'column';
                controls.style.gap = '5px';
                const zoomIn = document.createElement('button');
                zoomIn.innerHTML = '+';
                zoomIn.style.width = '30px';
                zoomIn.style.height = '30px';
                zoomIn.style.backgroundColor = 'white';
                zoomIn.style.border = 'none';
                zoomIn.style.borderRadius = '4px';
                zoomIn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                zoomIn.style.cursor = 'pointer';
                const zoomOut = document.createElement('button');
                zoomOut.innerHTML = '−';
                zoomOut.style.width = '30px';
                zoomOut.style.height = '30px';
                zoomOut.style.backgroundColor = 'white';
                zoomOut.style.border = 'none';
                zoomOut.style.borderRadius = '4px';
                zoomOut.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                zoomOut.style.cursor = 'pointer';
                controls.appendChild(zoomIn);
                controls.appendChild(zoomOut);
                mapElement.appendChild(controls);
            }
        };
        renderMap();
    }, [branches, selectedBranch, setSelectedBranch]);
    useEffect(() => {
        // Update marker styles when selected branch changes
        markersRef.current.forEach((marker, index) => {
            if (branches[index]?.id === selectedBranch?.id) {
                marker.style.backgroundColor = '#ec4899';
                marker.style.transform = 'scale(1.5)';
            } else {
                marker.style.backgroundColor = '#9333ea';
                marker.style.transform = 'scale(1)';
            }
        });
    }, [selectedBranch, branches]);
    return <div ref={mapRef} className='w-full h-96 bg-gray-100 rounded-3xl shadow-xl overflow-hidden' />;
}
