import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L, { type LatLngExpression } from 'leaflet';


const customIcon = new L.DivIcon({
    className: 'custom-marker',
    html: `
        <div style="position: relative; width: 32px; height: 42px; cursor: pointer;">
            <div style="
                position: absolute;
                top: 0; left: 0;
                width: 32px; height: 32px;
                background: #ffd700;
                border: 3px solid #ffffff;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            "></div>
            <div style="
                position: absolute;
                top: 9px; left: 9px;
                width: 14px; height: 14px;
                background: #20201f;
                border-radius: 50%;
            "></div>
            <div style="
                position: absolute;
                top: 0; left: 0;
                width: 32px; height: 32px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                background: #ffd700;
                opacity: 0.5;
                animation: pulseMarker 1.8s ease-out infinite;
            "></div>
        </div>
        <style>
            @keyframes pulseMarker {
                0%   { transform: rotate(-45deg) scale(1);   opacity: 0.5; }
                100% { transform: rotate(-45deg) scale(2.2); opacity: 0; }
            }
        </style>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 38],
    popupAnchor: [0, -36],
});

const PetaInteraktif: React.FC = () => {
    const posisiPusat: LatLngExpression = [-6.200000, 106.816666];
    const [lat, lng] = posisiPusat as [number, number];

    // URL Google Maps berdasarkan koordinat titik
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

    const markerRef = useRef<L.Marker>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            markerRef.current?.openPopup();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const bukaGoogleMaps = () => {
        window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <section className="w-full h-72 md:h-96 relative overflow-hidden border border-[#4d4732] z-0">

            <MapContainer
                center={posisiPusat}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', backgroundColor: '#f4f1ea' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                <Marker
                    position={posisiPusat}
                    icon={customIcon}
                    ref={markerRef}
                    eventHandlers={{
                        click: bukaGoogleMaps,
                    }}
                >
                    <Popup
                        autoClose={false}
                        closeOnClick={false}
                        closeButton={true}
                    >
                        <div className="text-center">
                            <strong className="text-gray-800 text-sm">Titik Pusat</strong><br />
                            <span className="text-xs text-gray-600">Area Jabodetabek</span><br />
                            <button
                                onClick={bukaGoogleMaps}
                                className="mt-2 inline-block text-xs font-semibold text-white bg-[#20201f] hover:bg-[#34322c] px-3 py-1.5 rounded transition-colors"
                            >
                                Buka di Google Maps
                            </button>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>

        </section>
    );
};

export default PetaInteraktif;