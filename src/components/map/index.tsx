'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface MapProps {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  className?: string;
}

const defaultCenter = {
  lat: 6.6018,  // Ho Technical University coordinates
  lng: 0.4700
};

export default function Map({ 
  center = defaultCenter, 
  zoom = 15,
  className = '' 
}: MapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Skeleton className="w-full h-96 rounded-lg" />;
  }

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    center.lng - 0.01
  }%2C${center.lat - 0.005}%2C${center.lng + 0.01}%2C${
    center.lat + 0.005
  }&amp;layer=mapnik&marker=${center.lat}%2C${center.lng}`;

  const fullMapUrl = `https://www.openstreetmap.org/?mlat=${center.lat}&mlon=${center.lng}#map=${zoom}/${center.lat}/${center.lng}`;

  return (
    <div className={`${className} relative`}>
      <div className="w-full h-96 rounded-lg overflow-hidden border-2 border-gray-200">
        {hasError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center p-4">
              <p className="text-red-500 font-medium">Failed to load map</p>
              <p className="text-sm text-gray-600 mt-1">
                <a 
                  href={fullMapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Open in OpenStreetMap
                </a>
              </p>
            </div>
          </div>
        ) : (
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={mapUrl}
            className="border-0"
            onError={() => setHasError(true)}
            title="Soucey Fast Food Location"
            aria-label="Interactive map showing Soucey Fast Food location"
          />
        )}
      </div>
      <div className="mt-2 text-sm text-gray-500 text-center">
        <p>
          <a 
            href={fullMapUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Larger Map
          </a>
        </p>
        <p className="text-xs mt-1">Campus Area, Ho Technical University, Ho, Volta Region, Ghana</p>
      </div>
    </div>
  );
}
