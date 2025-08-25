import React, { useEffect, useState, useRef } from 'react';
import { Navigation, Waves, AlertTriangle } from 'lucide-react';

const ShipMap = () => {
  const mapRef = useRef(null);
  const [vessels, setVessels] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef();
  const mapInstance = useRef(null);
  const markersRef = useRef({});

  // Enhanced error handling for Leaflet loading
  useEffect(() => {
    let leafletCheckInterval;
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds timeout

    const checkLeaflet = () => {
      attempts++;
      if (window.L && window.L.map) {
        setLeafletLoaded(true);
        if (leafletCheckInterval) clearInterval(leafletCheckInterval);
      } else if (attempts >= maxAttempts) {
        setError('Failed to load map library. Please refresh the page.');
        if (leafletCheckInterval) clearInterval(leafletCheckInterval);
      }
    };

    checkLeaflet();
    leafletCheckInterval = setInterval(checkLeaflet, 100);

    return () => {
      if (leafletCheckInterval) clearInterval(leafletCheckInterval);
    };
  }, []);

  // Load Leaflet with better error handling
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Check if already loaded
        if (window.L) {
          setLeafletLoaded(true);
          return;
        }

        // Load CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
          cssLink.onerror = () => setError('Failed to load map styles');
          document.head.appendChild(cssLink);
        }

        // Load JS
        if (!document.querySelector('script[src*="leaflet"]')) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
          script.onload = () => {
            setTimeout(() => setLeafletLoaded(true), 100);
          };
          script.onerror = () => setError('Failed to load map library');
          document.head.appendChild(script);
        }
      } catch (err) {
        setError('Error loading map resources: ' + err.message);
      }
    };

    loadLeaflet();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Cleanup map instance
      if (mapInstance.current) {
        try {
          mapInstance.current.remove();
        } catch (e) {
          console.warn('Map cleanup warning:', e);
        }
        mapInstance.current = null;
      }
    };
  }, []);

  // Initialize map with error handling
  const initializeMap = () => {
    if (!mapRef.current || mapInstance.current || !window.L || error) return;

    try {
      const L = window.L;
      
      // Create map with better error handling
      mapInstance.current = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
        attributionControl: true,
        preferCanvas: true // Better performance
      });

      // Add multiple tile layer options with fallbacks
      const primaryTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 18,
        errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjZGRkIi8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5Ij5NYXAgVGlsZTwvdGV4dD4KPC9zdmc+'
      });

      primaryTileLayer.on('tileerror', (e) => {
        console.warn('Tile loading error:', e);
      });

      primaryTileLayer.addTo(mapInstance.current);

      // Add ocean labels overlay with error handling
      try {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
          attribution: '© CARTO',
          pane: 'shadowPane',
          opacity: 0.7
        }).addTo(mapInstance.current);
      } catch (labelError) {
        console.warn('Label overlay failed:', labelError);
      }

      setMapInitialized(true);
      initializeVessels();

    } catch (error) {
      console.error('Map initialization error:', error);
      setError('Failed to initialize map: ' + error.message);
    }
  };

  // Initialize map when ready
  useEffect(() => {
    if (leafletLoaded && !mapInitialized && !error) {
      initializeMap();
    }
  }, [leafletLoaded, mapInitialized, error]);

  // Enhanced ship icon creation with error handling
  const createShipIcon = (heading = 0, type = 'default', speed = 0, name = '', status = 'underway') => {
    if (!window.L) return null;

    try {
      const typeConfig = {
        cargo: { color: '#e74c3c', size: 28 },
        tanker: { color: '#f39c12', size: 32 },
        passenger: { color: '#2ecc71', size: 30 },
        container: { color: '#9b59b6', size: 30 },
        cruise: { color: '#1abc9c', size: 34 },
        ferry: { color: '#34495e', size: 26 },
        naval: { color: '#95a5a6', size: 28 },
        default: { color: '#3498db', size: 24 }
      };

      const config = typeConfig[type] || typeConfig.default;
      const statusColor = status === 'anchored' ? '#f39c12' : 
                         status === 'underway' ? config.color : '#95a5a6';

      return window.L.divIcon({
        className: 'ship-marker',
        html: `
          <div style="transform: rotate(${heading}deg); position: relative;">
            <svg width="${config.size}" height="${config.size}" viewBox="0 0 32 32" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
              <path d="M16 4 L6 22 L10 26 L22 26 L26 22 Z" fill="${statusColor}" stroke="#fff" stroke-width="2" opacity="0.9"/>
              <rect x="13" y="8" width="6" height="8" fill="#fff" stroke="${statusColor}" stroke-width="1" rx="1"/>
              <circle cx="16" cy="6" r="2" fill="#ff4444"/>
            </svg>
            <div style="
              position: absolute;
              top: ${config.size + 4}px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(0,0,0,0.8);
              color: white;
              padding: 2px 6px;
              border-radius: 8px;
              font-size: 9px;
              font-weight: bold;
              white-space: nowrap;
              max-width: 120px;
              text-overflow: ellipsis;
              overflow: hidden;
            ">${name}</div>
          </div>
        `,
        iconSize: [config.size, config.size + 25],
        iconAnchor: [config.size/2, config.size/2]
      });
    } catch (error) {
      console.warn('Icon creation error:', error);
      return null;
    }
  };

  // Safe bearing calculation
  const calculateBearing = (lat1, lon1, lat2, lon2) => {
    try {
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
      const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) - 
                Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
      return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    } catch (error) {
      console.warn('Bearing calculation error:', error);
      return 0;
    }
  };

  // Ocean routes with validation
  const getOceanRoute = (routeName) => {
    const routes = {
      'transatlantic': [
        [51.5, -0.12], [49.0, -15.0], [42.0, -45.0], [40.7, -74.0]
      ],
      'transpacific': [
        [35.6, 139.7], [42.0, 170.0], [45.0, -160.0], [37.7, -122.4]
      ],
      'mediterranean': [
        [41.9, 12.5], [35.0, 20.0], [30.0, 32.5], [25.2, 55.3]
      ],
      'cape_route': [
        [-33.9, 18.4], [-30.0, 35.0], [0.0, 75.0], [1.3, 103.8]
      ]
    };
    return routes[routeName] || routes['transatlantic'];
  };

  // Initialize vessels with error handling
  const initializeVessels = () => {
    try {
      const ships = [
        {
          mmsi: '235123456',
          name: 'Atlantic Explorer',
          type: 'cargo',
          speed: 14.2,
          route: getOceanRoute('transatlantic'),
          currentWaypoint: 0,
          lat: 51.5,
          lon: -0.12,
          heading: 245,
          status: 'underway',
          destination: 'New York',
          flag: 'UK'
        },
        {
          mmsi: '477123789',
          name: 'Pacific Voyager',
          type: 'tanker',
          speed: 11.8,
          route: getOceanRoute('transpacific'),
          currentWaypoint: 0,
          lat: 35.6,
          lon: 139.7,
          heading: 45,
          status: 'underway',
          destination: 'San Francisco',
          flag: 'Japan'
        },
        {
          mmsi: '636789123',
          name: 'Mediterranean Star',
          type: 'cruise',
          speed: 18.5,
          route: getOceanRoute('mediterranean'),
          currentWaypoint: 0,
          lat: 41.9,
          lon: 12.5,
          heading: 120,
          status: 'underway',
          destination: 'Dubai',
          flag: 'Italy'
        },
        {
          mmsi: '413456789',
          name: 'Cape Navigator',
          type: 'container',
          speed: 16.3,
          route: getOceanRoute('cape_route'),
          currentWaypoint: 0,
          lat: -33.9,
          lon: 18.4,
          heading: 80,
          status: 'underway',
          destination: 'Singapore',
          flag: 'South Africa'
        }
      ];

      setVessels(ships);
      addVesselsToMap(ships);
    } catch (error) {
      console.error('Vessel initialization error:', error);
      setError('Failed to initialize vessels');
    }
  };

  // Add vessels to map with error handling
  const addVesselsToMap = (ships) => {
    if (!mapInstance.current || !window.L || error) return;

    try {
      const L = window.L;

      ships.forEach(vessel => {
        try {
          const icon = createShipIcon(vessel.heading, vessel.type, vessel.speed, vessel.name, vessel.status);
          if (!icon) return;

          const marker = L.marker([vessel.lat, vessel.lon], { icon }).addTo(mapInstance.current);

          const popupContent = `
            <div style="font-family: 'Arial', sans-serif; min-width: 200px;">
              <h3 style="margin: 0 0 10px 0; color: #2c3e50;">${vessel.name}</h3>
              <p><strong>Type:</strong> ${vessel.type}</p>
              <p><strong>Speed:</strong> ${vessel.speed} knots</p>
              <p><strong>Destination:</strong> ${vessel.destination}</p>
              <p><strong>Flag:</strong> ${vessel.flag}</p>
            </div>
          `;

          marker.bindPopup(popupContent);

          // Add route line
          const routeLine = L.polyline(vessel.route, {
            color: vessel.type === 'tanker' ? '#f39c12' : '#3498db',
            weight: 2,
            opacity: 0.7,
            dashArray: '5,5'
          }).addTo(mapInstance.current);

          markersRef.current[vessel.mmsi] = { marker, routeLine };
        } catch (vesselError) {
          console.warn(`Error adding vessel ${vessel.name}:`, vesselError);
        }
      });
    } catch (error) {
      console.error('Error adding vessels to map:', error);
    }
  };

  // Update positions with error handling
  const updateVesselPositions = () => {
    if (!mapInstance.current || !window.L || error) return;

    try {
      setVessels(prevVessels => 
        prevVessels.map(vessel => {
          try {
            const route = vessel.route;
            const currentWaypoint = vessel.currentWaypoint;
            
            if (currentWaypoint >= route.length - 1) {
              return vessel;
            }

            const current = [vessel.lat, vessel.lon];
            const target = route[currentWaypoint + 1];
            
            const distance = Math.sqrt(
              Math.pow(target[0] - current[0], 2) + Math.pow(target[1] - current[1], 2)
            );

            if (distance < 0.5) {
              return {
                ...vessel,
                lat: target[0],
                lon: target[1],
                currentWaypoint: currentWaypoint + 1
              };
            }

            const speed = 0.02;
            const newLat = current[0] + (target[0] - current[0]) * speed;
            const newLon = current[1] + (target[1] - current[1]) * speed;
            const bearing = calculateBearing(current[0], current[1], target[0], target[1]);

            // Update marker
            const markerData = markersRef.current[vessel.mmsi];
            if (markerData && markerData.marker) {
              markerData.marker.setLatLng([newLat, newLon]);
              const newIcon = createShipIcon(bearing, vessel.type, vessel.speed, vessel.name, vessel.status);
              if (newIcon) {
                markerData.marker.setIcon(newIcon);
              }
            }

            return {
              ...vessel,
              lat: newLat,
              lon: newLon,
              heading: bearing
            };
          } catch (vesselError) {
            console.warn(`Error updating vessel ${vessel.name}:`, vesselError);
            return vessel;
          }
        })
      );
    } catch (error) {
      console.error('Error updating positions:', error);
    }
  };

  // Simulation control
  useEffect(() => {
    if (isSimulating && mapInitialized && !error) {
      intervalRef.current = setInterval(updateVesselPositions, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSimulating, mapInitialized, error]);

  // Auto-start simulation
  useEffect(() => {
    if (mapInitialized && !error) {
      setIsSimulating(true);
    }
  }, [mapInitialized, error]);

  if (error) {
    return (
      <div style={{
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        border: "1px solid '#dee2e6",
        borderRadius: '12px',
        color: '#dc3545',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div>
          <AlertTriangle size={48} style={{ marginBottom: '1rem' }} />
          <h3>Map Loading Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
      {/* Loading overlay */}
      {!mapInitialized && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          color: '#6c757d'
        }}>
          <div style={{ textAlign: 'center' }}>
            <Waves size={32} style={{ marginBottom: '1rem', animation: 'pulse 2s infinite' }} />
            <div>Loading Maritime Map...</div>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        zIndex: 1000,
        background: 'rgba(255,255,255,0.95)',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minWidth: '200px'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#2c3e50', display: 'flex', alignItems: 'center' }}>
          <Navigation size={18} style={{ marginRight: '0.5rem' }} />
          Fleet Control
        </h4>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            disabled={!mapInitialized}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: isSimulating ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: mapInitialized ? 'pointer' : 'not-allowed',
              fontSize: '0.875rem'
            }}
          >
            {isSimulating ? 'Pause' : 'Start'}
          </button>
          
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Reset
          </button>
        </div>

        <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
          <div>Vessels: {vessels.length}</div>
          <div style={{ color: isSimulating ? '#28a745' : '#dc3545' }}>
            {isSimulating ? 'Active' : 'Paused'}
          </div>
        </div>
      </div>

      {/* Vessel List */}
      {vessels.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 1000,
          background: 'rgba(255,255,255,0.95)',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          maxWidth: '250px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>Active Vessels</h4>
          
          {vessels.map(vessel => (
            <div
              key={vessel.mmsi}
              style={{
                padding: '0.5rem',
                marginBottom: '0.5rem',
                backgroundColor: selectedVessel?.mmsi === vessel.mmsi ? '#e3f2fd' : '#f8f9fa',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                border: '1px solid #e9ecef'
              }}
              onClick={() => {
                setSelectedVessel(vessel);
                if (mapInstance.current && markersRef.current[vessel.mmsi]) {
                  mapInstance.current.setView([vessel.lat, vessel.lon], 6);
                  markersRef.current[vessel.mmsi].marker.openPopup();
                }
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {vessel.name}
              </div>
              <div style={{ color: '#6c757d' }}>
                {vessel.speed.toFixed(1)} kn • {vessel.type}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Map container */}
      <div
        ref={mapRef}
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: '#e9ecef',
          borderRadius: '12px'
        }}
      />
    </div>
  );
};

export default ShipMap;