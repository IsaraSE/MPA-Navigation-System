import React, { useEffect, useState, useRef } from 'react';
import { Navigation, Waves, AlertTriangle, ZoomIn, ZoomOut, Home, Maximize2, Minimize2, Shield, Leaf, Fish, Eye, EyeOff } from 'lucide-react';

const ShipMapWithZones = () => {
  const mapRef = useRef(null);
  const [vessels, setVessels] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sensitiveZones, setSensitiveZones] = useState([]);
  const [zonesVisible, setZonesVisible] = useState(true);
  const [loadingZones, setLoadingZones] = useState(false);
  const intervalRef = useRef();
  const mapInstance = useRef(null);
  const markersRef = useRef({});
  const zonesLayerRef = useRef(null);

  // Enhanced error handling for Leaflet loading
  useEffect(() => {
    let leafletCheckInterval;
    let attempts = 0;
    const maxAttempts = 50;

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
        if (window.L) {
          setLeafletLoaded(true);
          return;
        }

        if (!document.querySelector('link[href*="leaflet"]')) {
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
          cssLink.onerror = () => setError('Failed to load map styles');
          document.head.appendChild(cssLink);
        }

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

  // Fetch Marine Protected Areas from ProtectedPlanet API
  const fetchMarineProtectedAreas = async () => {
    try {
      setLoadingZones(true);
      
      // Using ProtectedPlanet API (World Database on Protected Areas)
      // This is a simplified approach - in production you'd want to fetch based on map bounds
      const response = await fetch(
        'https://api.protectedplanet.net/v3/protected_areas?filter[designation]=National%20Marine%20Sanctuary,Marine%20Protected%20Area,Marine%20Reserve&per_page=50',
        {
          headers: {
            'Accept': 'application/vnd.api+json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch protected areas');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.warn('ProtectedPlanet API error, using fallback data:', error);
      return getFallbackSensitiveZones();
    } finally {
      setLoadingZones(false);
    }
  };

  // Fetch from OpenStreetMap Overpass API for marine protected areas
  const fetchOSMMarineAreas = async () => {
    try {
      const overpassQuery = `
        [out:json][timeout:25];
        (
          relation[boundary=protected_area][protect_class~"^(1|2|3|4|5|6)$"][marine=yes];
          relation[boundary=national_park][marine=yes];
          relation[leisure=nature_reserve][marine=yes];
        );
        out geom;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'data=' + encodeURIComponent(overpassQuery)
      });

      if (!response.ok) {
        throw new Error('OSM Overpass API error');
      }

      const data = await response.json();
      return data.elements || [];
    } catch (error) {
      console.warn('OSM API error:', error);
      return [];
    }
  };

  // Fallback sensitive zones data (real-world locations)
  const getFallbackSensitiveZones = () => {
    return [
      {
        id: 'great_barrier_reef',
        name: 'Great Barrier Reef Marine Park',
        type: 'marine_protected_area',
        coordinates: [
          [-10.5, 142.0], [-10.5, 145.8], [-24.5, 145.8], [-24.5, 142.0], [-10.5, 142.0]
        ],
        description: 'World Heritage marine protected area',
        restrictions: 'No anchoring, speed restrictions, waste discharge prohibited',
        authority: 'Great Barrier Reef Marine Park Authority',
        severity: 'high'
      },
      {
        id: 'monterey_bay',
        name: 'Monterey Bay National Marine Sanctuary',
        type: 'national_marine_sanctuary',
        coordinates: [
          [35.5, -121.0], [35.5, -122.5], [37.0, -122.5], [37.0, -121.0], [35.5, -121.0]
        ],
        description: 'Critical habitat for marine mammals and seabirds',
        restrictions: 'Speed restrictions for whale protection, no dumping',
        authority: 'NOAA',
        severity: 'high'
      },
      {
        id: 'wadden_sea',
        name: 'Wadden Sea World Heritage Site',
        type: 'world_heritage_site',
        coordinates: [
          [53.3, 6.0], [53.3, 8.5], [55.0, 8.5], [55.0, 6.0], [53.3, 6.0]
        ],
        description: 'Tidal flat ecosystem, critical for migratory birds',
        restrictions: 'Seasonal navigation restrictions, draft limitations',
        authority: 'Trilateral Wadden Sea Cooperation',
        severity: 'medium'
      },
      {
        id: 'galapagos_marine_reserve',
        name: 'Galápagos Marine Reserve',
        type: 'marine_reserve',
        coordinates: [
          [1.5, -92.0], [1.5, -89.0], [-1.5, -89.0], [-1.5, -92.0], [1.5, -92.0]
        ],
        description: 'Unique ecosystem with endemic species',
        restrictions: 'Restricted access, authorized vessels only',
        authority: 'Galápagos National Park Service',
        severity: 'critical'
      },
      {
        id: 'antarctic_specially_protected',
        name: 'Antarctic Specially Protected Area',
        type: 'specially_protected_area',
        coordinates: [
          [-60.0, -65.0], [-60.0, -55.0], [-65.0, -55.0], [-65.0, -65.0], [-60.0, -65.0]
        ],
        description: 'Pristine Antarctic marine environment',
        restrictions: 'Permit required, environmental impact assessment',
        authority: 'Antarctic Treaty System',
        severity: 'critical'
      },
      {
        id: 'north_sea_natura2000',
        name: 'North Sea Natura 2000 Sites',
        type: 'natura2000',
        coordinates: [
          [54.0, 3.0], [54.0, 7.0], [56.0, 7.0], [56.0, 3.0], [54.0, 3.0]
        ],
        description: 'European network of protected marine areas',
        restrictions: 'Seasonal fishing restrictions, seabird protection',
        authority: 'European Union',
        severity: 'medium'
      },
      {
        id: 'coral_triangle',
        name: 'Coral Triangle Marine Protected Area',
        type: 'marine_biodiversity_hotspot',
        coordinates: [
          [-5.0, 110.0], [-5.0, 135.0], [5.0, 135.0], [5.0, 110.0], [-5.0, 110.0]
        ],
        description: 'Global center of marine biodiversity',
        restrictions: 'Coral protection measures, anchor restrictions',
        authority: 'Coral Triangle Initiative',
        severity: 'high'
      },
      {
        id: 'mediterranean_spami',
        name: 'Mediterranean SPAMI Network',
        type: 'specially_protected_area',
        coordinates: [
          [36.0, 0.0], [36.0, 15.0], [42.0, 15.0], [42.0, 0.0], [36.0, 0.0]
        ],
        description: 'Specially Protected Areas of Mediterranean Importance',
        restrictions: 'Habitat protection, fishing regulations',
        authority: 'UNEP-MAP',
        severity: 'medium'
      }
    ];
  };

  // Initialize map
  const initializeMap = () => {
    if (!mapRef.current || mapInstance.current || !window.L || error) return;

    try {
      const L = window.L;
      
      mapInstance.current = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: false,
        attributionControl: true,
        preferCanvas: true
      });

      const primaryTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 18,
        errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjZGRkIi8+Cjx0ZXh0IHg9IjEyOCIgeT0iMTI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5Ij5NYXAgVGlsZTwvdGV4dD4KPC9zdmc+'
      });

      primaryTileLayer.addTo(mapInstance.current);

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
      loadSensitiveZones();

    } catch (error) {
      console.error('Map initialization error:', error);
      setError('Failed to initialize map: ' + error.message);
    }
  };

  // Load sensitive zones
  const loadSensitiveZones = async () => {
    try {
      setLoadingZones(true);
      
      // Try to fetch from APIs, fallback to local data
      let zones = [];
      
      try {
        // Uncomment to use real APIs (may require API keys or have CORS issues)
        // const protectedAreas = await fetchMarineProtectedAreas();
        // const osmAreas = await fetchOSMMarineAreas();
        // zones = [...protectedAreas, ...osmAreas];
        
        // For now, using fallback data with real-world coordinates
        zones = getFallbackSensitiveZones();
      } catch (apiError) {
        console.warn('API fetch failed, using fallback:', apiError);
        zones = getFallbackSensitiveZones();
      }

      setSensitiveZones(zones);
      addSensitiveZonesToMap(zones);
      
    } catch (error) {
      console.error('Error loading sensitive zones:', error);
      setSensitiveZones(getFallbackSensitiveZones());
    } finally {
      setLoadingZones(false);
    }
  };

  // Add sensitive zones to map
  const addSensitiveZonesToMap = (zones) => {
    if (!mapInstance.current || !window.L) return;

    try {
      const L = window.L;

      // Create layer group for zones
      if (zonesLayerRef.current) {
        mapInstance.current.removeLayer(zonesLayerRef.current);
      }
      zonesLayerRef.current = L.layerGroup().addTo(mapInstance.current);

      zones.forEach(zone => {
        try {
          const severityConfig = {
            critical: { color: '#dc3545', fillOpacity: 0.3, weight: 3 },
            high: { color: '#fd7e14', fillOpacity: 0.25, weight: 2 },
            medium: { color: '#ffc107', fillOpacity: 0.2, weight: 2 },
            low: { color: '#28a745', fillOpacity: 0.15, weight: 1 }
          };

          const config = severityConfig[zone.severity] || severityConfig.medium;

          // Create polygon
          const polygon = L.polygon(zone.coordinates, {
            ...config,
            dashArray: zone.severity === 'critical' ? '10,10' : null
          });

          // Add popup with zone information
          const popupContent = `
            <div style="font-family: 'Arial', sans-serif; min-width: 250px; max-width: 300px;">
              <h3 style="margin: 0 0 10px 0; color: #2c3e50; display: flex; align-items: center;">
                <span style="color: ${config.color}; margin-right: 8px;">
                  ${zone.severity === 'critical' ? '🚫' : zone.severity === 'high' ? '⚠️' : zone.severity === 'medium' ? '⚡' : '🛡️'}
                </span>
                ${zone.name}
              </h3>
              <p><strong>Type:</strong> ${zone.type.replace(/_/g, ' ').toUpperCase()}</p>
              <p><strong>Description:</strong> ${zone.description}</p>
              <p><strong>Authority:</strong> ${zone.authority}</p>
              <div style="background: #f8f9fa; padding: 8px; border-left: 4px solid ${config.color}; margin: 10px 0;">
                <strong>Restrictions:</strong><br>
                ${zone.restrictions}
              </div>
              <p style="color: ${config.color}; font-weight: bold; margin: 5px 0;">
                Severity: ${zone.severity.toUpperCase()}
              </p>
            </div>
          `;

          polygon.bindPopup(popupContent);

          // Add to layer group
          polygon.addTo(zonesLayerRef.current);

          // Add zone center marker for better visibility
          if (zone.coordinates && zone.coordinates.length > 2) {
            const bounds = L.polygon(zone.coordinates).getBounds();
            const center = bounds.getCenter();

            const zoneMarker = L.circleMarker(center, {
              radius: 8,
              fillColor: config.color,
              color: '#fff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8
            });

            zoneMarker.bindPopup(popupContent);
            zoneMarker.addTo(zonesLayerRef.current);
          }

        } catch (zoneError) {
          console.warn(`Error adding zone ${zone.name}:`, zoneError);
        }
      });

    } catch (error) {
      console.error('Error adding zones to map:', error);
    }
  };

  // Toggle zones visibility
  const toggleZonesVisibility = () => {
    if (!mapInstance.current || !zonesLayerRef.current) return;

    if (zonesVisible) {
      mapInstance.current.removeLayer(zonesLayerRef.current);
    } else {
      zonesLayerRef.current.addTo(mapInstance.current);
    }
    setZonesVisible(!zonesVisible);
  };

  // Initialize map when ready
  useEffect(() => {
    if (leafletLoaded && !mapInitialized && !error) {
      initializeMap();
    }
  }, [leafletLoaded, mapInitialized, error]);

  // Enhanced ship icon creation
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

  // Map control functions
  const zoomIn = () => {
    if (mapInstance.current) {
      mapInstance.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (mapInstance.current) {
      mapInstance.current.zoomOut();
    }
  };

  const resetView = () => {
    if (mapInstance.current) {
      mapInstance.current.setView([20, 0], 2);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Ocean routes
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

  // Initialize vessels
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

  // Add vessels to map
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

  // Update positions
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
        height: isFullscreen ? '100vh' : '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        border: "1px solid #dee2e6",
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
    <div style={{ 
      position: isFullscreen ? 'fixed' : 'relative', 
      top: isFullscreen ? 0 : 'auto',
      left: isFullscreen ? 0 : 'auto',
      height: isFullscreen ? '100vh' : '500px', 
      width: isFullscreen ? '100vw' : '100%',
      zIndex: isFullscreen ? 9999 : 'auto',
      backgroundColor: isFullscreen ? '#000' : 'transparent'
    }}>
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
            <div>Loading Maritime Map with Environmental Zones...</div>
          </div>
        </div>
      )}

      {/* Fleet Control Panel - Top Left */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        zIndex: 1000,
        background: 'rgba(255,255,255,0.95)',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minWidth: '220px'
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

        <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '1rem' }}>
          <div>Vessels: {vessels.length}</div>
          <div style={{ color: isSimulating ? '#28a745' : '#dc3545' }}>
            {isSimulating ? 'Active' : 'Paused'}
          </div>
        </div>

        {/* Environmental Zones Control */}
        <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '1rem' }}>
          <h5 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50', display: 'flex', alignItems: 'center' }}>
            <Shield size={16} style={{ marginRight: '0.5rem' }} />
            Environmental Zones
          </h5>
          
          <button
            onClick={toggleZonesVisibility}
            disabled={loadingZones}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: zonesVisible ? '#17a2b8' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loadingZones ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              justifyContent: 'center'
            }}
          >
            {zonesVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            {loadingZones ? 'Loading...' : (zonesVisible ? 'Hide Zones' : 'Show Zones')}
          </button>

          <div style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: '0.5rem' }}>
            {sensitiveZones.length} zones loaded
          </div>
        </div>
      </div>

      {/* Environmental Zones Legend - Bottom Left */}
      {zonesVisible && sensitiveZones.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          zIndex: 1000,
          background: 'rgba(255,255,255,0.95)',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          maxWidth: '280px'
        }}>
          <h5 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50', display: 'flex', alignItems: 'center' }}>
            <Leaf size={16} style={{ marginRight: '0.5rem' }} />
            Zone Severity Legend
          </h5>
          
          <div style={{ fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#dc3545', marginRight: '0.5rem', borderRadius: '2px' }}></div>
              <span>Critical - Restricted Access</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#fd7e14', marginRight: '0.5rem', borderRadius: '2px' }}></div>
              <span>High - Special Precautions</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#ffc107', marginRight: '0.5rem', borderRadius: '2px' }}></div>
              <span>Medium - Regulated Activity</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#28a745', marginRight: '0.5rem', borderRadius: '2px' }}></div>
              <span>Low - Protected Area</span>
            </div>
          </div>
        </div>
      )}

      {/* Map Zoom Controls - Top Right */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: vessels.length > 0 ? '270px' : '1rem',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
      }}>
        <button
          onClick={zoomIn}
          disabled={!mapInitialized}
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: mapInitialized ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            color: '#333'
          }}
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        
        <button
          onClick={zoomOut}
          disabled={!mapInitialized}
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: mapInitialized ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            color: '#333'
          }}
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        
        <button
          onClick={resetView}
          disabled={!mapInitialized}
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: mapInitialized ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            color: '#333'
          }}
          title="Reset View"
        >
          <Home size={18} />
        </button>

        <button
          onClick={toggleFullscreen}
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            color: '#333'
          }}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      {/* Vessel List - Far Right */}
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
          width: '250px',
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

      {/* Environmental Zones Info Panel - Right Side */}
      {zonesVisible && sensitiveZones.length > 0 && (
        <div style={{
          position: 'absolute',
          top: vessels.length > 0 ? '320px' : '1rem',
          right: '1rem',
          zIndex: 1000,
          background: 'rgba(255,255,255,0.95)',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          width: '250px',
          maxHeight: '250px',
          overflowY: 'auto'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#2c3e50', display: 'flex', alignItems: 'center' }}>
            <Fish size={18} style={{ marginRight: '0.5rem' }} />
            Protected Areas
          </h4>
          
          {sensitiveZones.slice(0, 4).map(zone => (
            <div
              key={zone.id}
              style={{
                padding: '0.5rem',
                marginBottom: '0.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                border: '1px solid #e9ecef',
                borderLeft: `4px solid ${
                  zone.severity === 'critical' ? '#dc3545' :
                  zone.severity === 'high' ? '#fd7e14' :
                  zone.severity === 'medium' ? '#ffc107' : '#28a745'
                }`
              }}
              onClick={() => {
                if (mapInstance.current && zone.coordinates && zone.coordinates.length > 2) {
                  const L = window.L;
                  const bounds = L.polygon(zone.coordinates).getBounds();
                  mapInstance.current.fitBounds(bounds);
                }
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {zone.name.length > 25 ? zone.name.substring(0, 25) + '...' : zone.name}
              </div>
              <div style={{ color: '#6c757d' }}>
                {zone.type.replace(/_/g, ' ').toUpperCase()} • {zone.severity.toUpperCase()}
              </div>
            </div>
          ))}
          
          {sensitiveZones.length > 4 && (
            <div style={{ fontSize: '0.75rem', color: '#6c757d', textAlign: 'center', fontStyle: 'italic' }}>
              +{sensitiveZones.length - 4} more zones...
            </div>
          )}
        </div>
      )}

      {/* Map container */}
      <div
        ref={mapRef}
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: '#e9ecef',
          borderRadius: isFullscreen ? '0' : '12px'
        }}
      />
    </div>
  );
};

export default ShipMapWithZones;