import React, { useEffect, useState, useRef } from 'react';
import { Navigation, Waves, AlertTriangle, ZoomIn, ZoomOut, Home, Maximize2, Minimize2, Shield, Leaf, Fish, Eye, EyeOff, ChevronDown, ChevronUp, Settings, MapPin, Bell, X, Gauge, AlertCircle, Droplet } from 'lucide-react';
import reportService from '../services/reportService';

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
  const [showVesselList, setShowVesselList] = useState(false);
  const [showZoneInfo, setShowZoneInfo] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(2);
  const [alerts, setAlerts] = useState([]);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [reports, setReports] = useState([]);
  const [reportsVisible, setReportsVisible] = useState(true);
  const [reportFilter, setReportFilter] = useState('all'); // 'all', 'hotspot', 'pollution'
  const [loadingReports, setLoadingReports] = useState(false);
  const intervalRef = useRef();
  const mapInstance = useRef(null);
  const markersRef = useRef({});
  const zonesLayerRef = useRef(null);
  const zoneIconsLayerRef = useRef(null);
  const reportsLayerRef = useRef(null);
  const alertTimeoutRef = useRef(null);
  const alertedVesselsRef = useRef(new Set()); // Track which vessels have triggered alerts

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
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
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

  // Fallback sensitive zones data (corrected coordinates)
  const getFallbackSensitiveZones = () => {
    return [
      {
        id: 'great_barrier_reef',
        name: 'Great Barrier Reef Marine Park',
        type: 'marine_protected_area',
        center: [-16.0, 145.8],
        radius: 200000,
        description: 'World Heritage marine protected area',
        restrictions: 'No anchoring, speed restrictions, waste discharge prohibited',
        authority: 'Great Barrier Reef Marine Park Authority',
        severity: 'high'
      },
      {
        id: 'monterey_bay',
        name: 'Monterey Bay National Marine Sanctuary',
        type: 'national_marine_sanctuary',
        center: [36.25, -121.75],
        radius: 75000,
        description: 'Critical habitat for marine mammals and seabirds',
        restrictions: 'Speed restrictions for whale protection, no dumping',
        authority: 'NOAA',
        severity: 'high'
      },
      {
        id: 'wadden_sea',
        name: 'Wadden Sea World Heritage Site',
        type: 'world_heritage_site',
        center: [54.15, 7.25],
        radius: 120000,
        description: 'Tidal flat ecosystem, critical for migratory birds',
        restrictions: 'Seasonal navigation restrictions, draft limitations',
        authority: 'Trilateral Wadden Sea Cooperation',
        severity: 'medium'
      },
      {
        id: 'galapagos_marine_reserve',
        name: 'Galápagos Marine Reserve',
        type: 'marine_reserve',
        center: [-0.5, -90.0],
        radius: 150000,
        description: 'Unique ecosystem with endemic species',
        restrictions: 'Restricted access, authorized vessels only',
        authority: 'Galápagos National Park Service',
        severity: 'critical'
      },
      {
        id: 'antarctic_specially_protected',
        name: 'Antarctic Specially Protected Area',
        type: 'specially_protected_area',
        center: [-62.5, -60.0],
        radius: 180000,
        description: 'Pristine Antarctic marine environment',
        restrictions: 'Permit required, environmental impact assessment',
        authority: 'Antarctic Treaty System',
        severity: 'critical'
      },
      {
        id: 'north_sea_natura2000',
        name: 'North Sea Natura 2000 Sites',
        type: 'natura2000',
        center: [55.0, 5.0],
        radius: 100000,
        description: 'European network of protected marine areas',
        restrictions: 'Seasonal fishing restrictions, seabird protection',
        authority: 'European Union',
        severity: 'medium'
      },
      {
        id: 'coral_triangle',
        name: 'Coral Triangle Marine Protected Area',
        type: 'marine_biodiversity_hotspot',
        center: [0.0, 122.5],
        radius: 250000,
        description: 'Global center of marine biodiversity',
        restrictions: 'Coral protection measures, anchor restrictions',
        authority: 'Coral Triangle Initiative',
        severity: 'high'
      },
      {
        id: 'mediterranean_spami',
        name: 'Mediterranean SPAMI Network',
        type: 'specially_protected_area',
        center: [39.0, 7.5],
        radius: 80000,
        description: 'Specially Protected Areas of Mediterranean Importance',
        restrictions: 'Habitat protection, fishing regulations',
        authority: 'UNEP-MAP',
        severity: 'medium'
      },
      {
        id: 'bering_sea_protected',
        name: 'Bering Sea Marine Protected Area',
        type: 'marine_protected_area',
        center: [60.0, -175.0],
        radius: 90000,
        description: 'Critical Arctic marine ecosystem',
        restrictions: 'Ice navigation protocols, wildlife protection',
        authority: 'NOAA Fisheries',
        severity: 'high'
      },
      {
        id: 'gulf_stream_sanctuary',
        name: 'Gulf Stream Marine Sanctuary',
        type: 'marine_sanctuary',
        center: [35.0, -75.0],
        radius: 60000,
        description: 'Important oceanic current system',
        restrictions: 'Current-sensitive navigation, protected species zones',
        authority: 'US Marine Sanctuary Program',
        severity: 'medium'
      },
      // New marine protected areas on real navigation routes
      {
        id: 'hawaii_humpback_whale',
        name: 'Hawaiian Islands Humpback Whale Sanctuary',
        type: 'marine_sanctuary',
        center: [21.0, -157.0],
        radius: 80000,
        description: 'Critical habitat for humpback whales',
        restrictions: 'Speed restrictions during whale season, no approaching whales',
        authority: 'NOAA',
        severity: 'high'
      },
      {
        id: 'channel_islands',
        name: 'Channel Islands Marine Sanctuary',
        type: 'marine_sanctuary',
        center: [34.0, -119.5],
        radius: 70000,
        description: 'Diverse marine ecosystem with unique species',
        restrictions: 'No-take zones, restricted anchoring',
        authority: 'NOAA',
        severity: 'high'
      },
      {
        id: 'suez_canal_protected',
        name: 'Suez Canal Marine Protected Zone',
        type: 'marine_protected_area',
        center: [30.5, 32.3],
        radius: 50000,
        description: 'Critical shipping lane with environmental protections',
        restrictions: 'Speed limits, no waste discharge, wildlife corridors',
        authority: 'Suez Canal Authority',
        severity: 'medium'
      },
      {
        id: 'strait_malacca',
        name: 'Strait of Malacca Protected Zone',
        type: 'marine_protected_area',
        center: [2.5, 101.0],
        radius: 60000,
        description: 'Busiest shipping lane with environmental safeguards',
        restrictions: 'Traffic separation schemes, speed limits, no anchoring',
        authority: 'IMO & Regional Cooperation',
        severity: 'high'
      }
    ];
  };

  // Ocean routes that avoid land (verified to be in water)
  const getOceanRoute = (routeName) => {
    const routes = {
      'transatlantic': [
        [51.5, -0.12], [48.0, -20.0], [40.0, -50.0], [40.7, -74.0] // London to New York
      ],
      'transpacific': [
        [35.6, 139.7], [40.0, 175.0], [45.0, -165.0], [37.7, -122.4] // Tokyo to San Francisco
      ],
      'mediterranean': [
        [41.9, 12.5], [36.0, 18.0], [32.0, 30.0], [25.2, 55.3] // Rome to Dubai
      ],
      'cape_route': [
        [-33.9, 18.4], [-35.0, 25.0], [-40.0, 60.0], [1.3, 103.8] // Cape Town to Singapore
      ],
      // New route that passes near the protected areas
      'protected_area_route': [
        [32.0, -120.0], [33.5, -121.0], [34.0, -119.5], [35.0, -118.0] // Passes near Channel Islands
      ],
      // Additional realistic routes
      'suez_canal_route': [
        [31.2, 29.9], [30.5, 32.3], [29.9, 32.6], [25.2, 55.3] // Alexandria to Dubai via Suez
      ],
      'malacca_strait_route': [
        [1.3, 103.8], [2.5, 101.0], [5.0, 97.0], [13.7, 100.5] // Singapore to Bangkok via Malacca
      ]
    };
    return routes[routeName] || routes['transatlantic'];
  };

  // Check if a vessel is near a protected zone
  const checkZoneProximity = (vessel, zones) => {
    const alerts = [];
    const alertKey = `${vessel.mmsi}-${vessel.currentWaypoint}`;
    
    // Skip if this vessel has already triggered an alert for this waypoint
    if (alertedVesselsRef.current.has(alertKey)) {
      return alerts;
    }
    
    zones.forEach(zone => {
      const distance = calculateDistance(
        vessel.lat, vessel.lon, 
        zone.center[0], zone.center[1]
      );
      
      // Alert if within 1.5x the zone radius
      if (distance < zone.radius * 1.5) {
        alerts.push({
          id: `${vessel.mmsi}-${zone.id}-${Date.now()}`,
          vessel: vessel.name,
          zone: zone.name,
          distance: Math.round(distance / 1000), // km
          severity: zone.severity,
          timestamp: new Date()
        });
        
        // Mark this vessel as having triggered an alert for this waypoint
        alertedVesselsRef.current.add(alertKey);
      }
    });
    
    return alerts;
  };

  // Calculate distance between two points (in meters)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Add alert to the system
  const addAlert = (alert) => {
    setAlerts(prev => {
      // Check if similar alert already exists (same vessel and zone)
      const exists = prev.some(a => 
        a.vessel === alert.vessel && a.zone === alert.zone && 
        (new Date() - a.timestamp) < 60000 // Within last minute
      );
      
      if (!exists) {
        return [alert, ...prev.slice(0, 9)]; // Keep only 10 latest alerts
      }
      return prev;
    });
  };

  // Remove alert by ID
  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
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
        errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5z='
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

      // Add zoom change listener
      mapInstance.current.on('zoomend', () => {
        const zoom = mapInstance.current.getZoom();
        setCurrentZoom(zoom);
        updateZoneDisplay(zoom);
      });

      setMapInitialized(true);
      initializeVessels();
      loadSensitiveZones();
      loadReports();

    } catch (error) {
      console.error('Map initialization error:', error);
      setError('Failed to initialize map: ' + error.message);
    }
  };

  // Load sensitive zones
  const loadSensitiveZones = async () => {
    try {
      setLoadingZones(true);
      
      // For now, using fallback data with corrected coordinates
      const zones = getFallbackSensitiveZones();
      setSensitiveZones(zones);
      addSensitiveZonesToMap(zones);
      
    } catch (error) {
      console.error('Error loading sensitive zones:', error);
      setSensitiveZones(getFallbackSensitiveZones());
    } finally {
      setLoadingZones(false);
    }
  };

  // Load reports from backend
  const loadReports = async () => {
    try {
      setLoadingReports(true);
      const data = await reportService.getReports({ limit: 200 });
      setReports(data.reports || []);
      if (mapInstance.current && data.reports) {
        addReportsToMap(data.reports);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      setReports([]);
    } finally {
      setLoadingReports(false);
    }
  };

  // Create zone icon based on severity
  const createZoneIcon = (zone) => {
    if (!window.L) return null;

    try {
      const severityConfig = {
        critical: { color: '#dc3545', icon: '🚫', size: 32 },
        high: { color: '#fd7e14', icon: '⚠️', size: 28 },
        medium: { color: '#ffc107', icon: '⚡', size: 24 },
        low: { color: '#28a745', icon: '🛡️', size: 20 }
      };

      const config = severityConfig[zone.severity] || severityConfig.medium;

      return window.L.divIcon({
        className: 'zone-icon-marker',
        html: `
          <div style="
            background: white;
            border: 3px solid ${config.color};
            border-radius: 50%;
            width: ${config.size}px;
            height: ${config.size}px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${config.size * 0.4}px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ${zone.severity === 'critical' ? 'animation: pulse-border 2s infinite;' : ''}
          ">
            ${config.icon}
          </div>
        `,
        iconSize: [config.size, config.size],
        iconAnchor: [config.size/2, config.size/2]
      });
    } catch (error) {
      console.warn('Zone icon creation error:', error);
      return null;
    }
  };

  // Add sensitive zones to map with zoom-dependent display
  const addSensitiveZonesToMap = (zones) => {
    if (!mapInstance.current || !window.L) return;

    try {
      const L = window.L;

      // Create layer groups for zones and icons
      if (zonesLayerRef.current) {
        mapInstance.current.removeLayer(zonesLayerRef.current);
      }
      if (zoneIconsLayerRef.current) {
        mapInstance.current.removeLayer(zoneIconsLayerRef.current);
      }

      zonesLayerRef.current = L.layerGroup();
      zoneIconsLayerRef.current = L.layerGroup();

      zones.forEach(zone => {
        try {
          const severityConfig = {
            critical: { color: '#dc3545', fillOpacity: 0.25, weight: 4 },
            high: { color: '#fd7e14', fillOpacity: 0.2, weight: 3 },
            medium: { color: '#ffc107', fillOpacity: 0.15, weight: 2 },
            low: { color: '#28a745', fillOpacity: 0.1, weight: 2 }
          };

          const config = severityConfig[zone.severity] || severityConfig.medium;

          // Create popup content
          const popupContent = `
            <div style="font-family: 'Arial', sans-serif; min-width: 280px; max-width: 320px;">
              <h3 style="margin: 0 0 12px 0; color: #2c3e50; display: flex; align-items: center; font-size: 1.1em;">
                <span style="color: ${config.color}; margin-right: 8px; font-size: 1.2em;">
                  ${zone.severity === 'critical' ? '🚫' : zone.severity === 'high' ? '⚠️' : zone.severity === 'medium' ? '⚡' : '🛡️'}
                </span>
                ${zone.name}
              </h3>
              <div style="margin-bottom: 10px;">
                <strong style="color: #495057;">Type:</strong> 
                <span style="color: #6c757d;">${zone.type.replace(/_/g, ' ').toUpperCase()}</span>
              </div>
              <div style="margin-bottom: 10px;">
                <strong style="color: #495057;">Coverage:</strong> 
                <span style="color: '6c757d';">${(zone.radius / 1000).toFixed(0)} km radius</span>
              </div>
              <p style="margin: 8px 0; color: #495057; line-height: 1.4;">
                <strong>Description:</strong><br>
                ${zone.description}
              </p>
              <p style="margin: 8px 0; color: #495057;">
                <strong>Authority:</strong> ${zone.authority}
              </p>
              <div style="background: #f8f9fa; padding: 10px; border-left: 4px solid ${config.color}; margin: 12px 0; border-radius: 0 4px 4px 0;">
                <strong style="color: #495057;">Navigation Restrictions:</strong><br>
                <span style="color: #6c757d; font-size: 0.95em; line-height: 1.3;">
                  ${zone.restrictions}
                </span>
              </div>
              <div style="text-align: center; margin-top: 10px;">
                <span style="
                  color: ${config.color}; 
                  font-weight: bold; 
                  background: ${config.color}15;
                  padding: 4px 12px;
                  border-radius: 20px;
                  border: 2px solid ${config.color};
                  font-size: 0.9em;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                ">
                  ${zone.severity} Risk Zone
                </span>
              </div>
            </div>
          `;

          // Create circle for detailed view (high zoom)
          const circle = L.circle(zone.center, {
            radius: zone.radius,
            ...config,
            dashArray: zone.severity === 'critical' ? '15,10' : zone.severity === 'high' ? '10,5' : null
          });
          circle.bindPopup(popupContent);

          // Add zone center marker for detailed view
          const centerMarker = L.circleMarker(zone.center, {
            radius: zone.severity === 'critical' ? 12 : zone.severity === 'high' ? 10 : 8,
            fillColor: config.color,
            color: '#fff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.9
          });
          centerMarker.bindPopup(popupContent);

          // Add to zones layer (for detailed view)
          circle.addTo(zonesLayerRef.current);
          centerMarker.addTo(zonesLayerRef.current);

          // Add pulsing effect for critical zones
          if (zone.severity === 'critical') {
            const pulseMarker = L.circleMarker(zone.center, {
              radius: 15,
              fillColor: config.color,
              color: config.color,
              weight: 2,
              opacity: 0.6,
              fillOpacity: 0.2,
              className: 'pulse-marker'
            });
            pulseMarker.addTo(zonesLayerRef.current);
          }

          // Create icon marker for overview (low zoom)
          const zoneIcon = createZoneIcon(zone);
          if (zoneIcon) {
            const iconMarker = L.marker(zone.center, { icon: zoneIcon });
            iconMarker.bindPopup(popupContent);
            iconMarker.addTo(zoneIconsLayerRef.current);
          }

        } catch (zoneError) {
          console.warn(`Error adding zone ${zone.name}:`, zoneError);
        }
      });

      // Add CSS for pulsing animation if not already added
      if (!document.querySelector('#zone-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'zone-animation-styles';
        style.textContent = `
          @keyframes leaflet-pulse {
            0% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.3); opacity: 0.3; }
            100% { transform: scale(1.6); opacity: 0; }
          }
          .pulse-marker {
            animation: leaflet-pulse 2s infinite;
          }
          @keyframes pulse-border {
            0% { border-width: 3px; }
            50% { border-width: 6px; }
            100% { border-width: 3px; }
          }
        `;
        document.head.appendChild(style);
      }

      // Initially show the appropriate layer based on current zoom
      updateZoneDisplay(mapInstance.current.getZoom());

    } catch (error) {
      console.error('Error adding zones to map:', error);
    }
  };

  // Update zone display based on zoom level
  const updateZoneDisplay = (zoom) => {
    if (!mapInstance.current || !zonesLayerRef.current || !zoneIconsLayerRef.current || !zonesVisible) return;

    try {
      // Show circles when zoomed in (zoom level 5 and above), icons when zoomed out
      if (zoom >= 5) {
        // Detailed view - show circles and center markers
        if (!mapInstance.current.hasLayer(zonesLayerRef.current)) {
          zonesLayerRef.current.addTo(mapInstance.current);
        }
        if (mapInstance.current.hasLayer(zoneIconsLayerRef.current)) {
          mapInstance.current.removeLayer(zoneIconsLayerRef.current);
        }
      } else {
        // Overview - show icons only
        if (mapInstance.current.hasLayer(zonesLayerRef.current)) {
          mapInstance.current.removeLayer(zonesLayerRef.current);
        }
        if (!mapInstance.current.hasLayer(zoneIconsLayerRef.current)) {
          zoneIconsLayerRef.current.addTo(mapInstance.current);
        }
      }
    } catch (error) {
      console.warn('Error updating zone display:', error);
    }
  };

  // Toggle zones visibility
  const toggleZonesVisibility = () => {
    if (!mapInstance.current || !zonesLayerRef.current || !zoneIconsLayerRef.current) return;

    if (zonesVisible) {
      // Hide both layers
      if (mapInstance.current.hasLayer(zonesLayerRef.current)) {
        mapInstance.current.removeLayer(zonesLayerRef.current);
      }
      if (mapInstance.current.hasLayer(zoneIconsLayerRef.current)) {
        mapInstance.current.removeLayer(zoneIconsLayerRef.current);
      }
    } else {
      // Show appropriate layer based on current zoom
      updateZoneDisplay(currentZoom);
    }
    setZonesVisible(!zonesVisible);
  };

  // Create report icon based on type and severity
  const createReportIcon = (report) => {
    if (!window.L) return null;

    try {
      const typeConfig = {
        hotspot: { 
          color: '#10b981', 
          icon: '🐟',
          bgGradient: 'linear-gradient(135deg, #10b981, #059669)'
        },
        pollution: { 
          color: '#ef4444', 
          icon: '🛢️',
          bgGradient: 'linear-gradient(135deg, #ef4444, #dc2626)'
        }
      };

      const severitySize = {
        low: 28,
        medium: 32,
        high: 36,
        critical: 40
      };

      const config = typeConfig[report.type] || typeConfig.hotspot;
      const size = severitySize[report.severity] || 32;

      return window.L.divIcon({
        className: 'report-marker',
        html: `
          <div style="
            background: ${config.bgGradient};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${size * 0.5}px;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            ${report.severity === 'critical' ? 'animation: pulse-report 2s infinite;' : ''}
          ">
            ${config.icon}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
        popupAnchor: [0, -size/2]
      });
    } catch (error) {
      console.warn('Report icon creation error:', error);
      return null;
    }
  };

  // Add reports to map
  const addReportsToMap = (reportsData) => {
    if (!mapInstance.current || !window.L) return;

    try {
      const L = window.L;

      // Remove existing reports layer
      if (reportsLayerRef.current) {
        mapInstance.current.removeLayer(reportsLayerRef.current);
      }

      reportsLayerRef.current = L.layerGroup();

      reportsData.forEach(report => {
        try {
          // Apply filter
          if (reportFilter !== 'all' && report.type !== reportFilter) {
            return;
          }

          const [lng, lat] = report.location.coordinates;
          
          const icon = createReportIcon(report);
          if (!icon) return;

          const marker = L.marker([lat, lng], { icon });

          // Create detailed popup
          const severityColors = {
            low: '#10b981',
            medium: '#f59e0b',
            high: '#f97316',
            critical: '#ef4444'
          };

          const popupContent = `
            <div style="font-family: 'Arial', sans-serif; min-width: 260px; max-width: 300px;">
              <div style="
                background: ${report.type === 'hotspot' ? '#10b98120' : '#ef444420'};
                padding: 12px;
                margin: -12px -12px 12px -12px;
                border-radius: 8px 8px 0 0;
                border-bottom: 3px solid ${report.type === 'hotspot' ? '#10b981' : '#ef4444'};
              ">
                <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 1.1em; display: flex; align-items: center;">
                  <span style="font-size: 1.3em; margin-right: 8px;">
                    ${report.type === 'hotspot' ? '🐟' : '🛢️'}
                  </span>
                  ${report.title}
                </h3>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  <span style="
                    background: ${report.type === 'hotspot' ? '#10b981' : '#ef4444'};
                    color: white;
                    padding: 3px 10px;
                    border-radius: 12px;
                    font-size: 0.75em;
                    font-weight: 600;
                    text-transform: uppercase;
                  ">
                    ${report.type}
                  </span>
                  <span style="
                    background: ${severityColors[report.severity]};
                    color: white;
                    padding: 3px 10px;
                    border-radius: 12px;
                    font-size: 0.75em;
                    font-weight: 600;
                    text-transform: uppercase;
                  ">
                    ${report.severity}
                  </span>
                </div>
              </div>
              
              ${report.species ? `
                <div style="margin-bottom: 10px;">
                  <strong style="color: #4b5563; font-size: 0.9em;">Species:</strong>
                  <span style="color: #1f2937; font-size: 0.9em; margin-left: 4px;">${report.species}</span>
                </div>
              ` : ''}
              
              <div style="margin-bottom: 10px;">
                <strong style="color: #4b5563; font-size: 0.9em;">Description:</strong>
                <p style="color: #1f2937; margin: 4px 0 0 0; font-size: 0.85em; line-height: 1.4;">
                  ${report.description}
                </p>
              </div>
              
              ${report.submittedBy ? `
                <div style="margin-bottom: 10px;">
                  <strong style="color: #4b5563; font-size: 0.9em;">Reported by:</strong>
                  <div style="color: #1f2937; margin-top: 4px; font-size: 0.85em;">
                    <div>${report.submittedBy.name}</div>
                    ${report.vesselInfo?.vesselName ? `
                      <div style="color: #6b7280; font-size: 0.9em;">
                        ${report.vesselInfo.vesselName} (${report.vesselInfo.vesselType})
                      </div>
                    ` : ''}
                  </div>
                </div>
              ` : ''}
              
              <div style="
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 0.75em;
              ">
                📅 ${new Date(report.createdAt).toLocaleDateString()} at ${new Date(report.createdAt).toLocaleTimeString()}
              </div>
            </div>
          `;

          marker.bindPopup(popupContent, {
            maxWidth: 320,
            className: 'custom-report-popup'
          });

          marker.addTo(reportsLayerRef.current);

        } catch (reportError) {
          console.warn(`Error adding report ${report._id}:`, reportError);
        }
      });

      // Add layer to map if reports are visible
      if (reportsVisible) {
        reportsLayerRef.current.addTo(mapInstance.current);
      }

      // Add CSS for pulsing animation
      if (!document.querySelector('#report-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'report-animation-styles';
        style.textContent = `
          @keyframes pulse-report {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
          }
          .custom-report-popup .leaflet-popup-content-wrapper {
            border-radius: 12px;
            padding: 0;
          }
          .custom-report-popup .leaflet-popup-content {
            margin: 12px;
          }
        `;
        document.head.appendChild(style);
      }

    } catch (error) {
      console.error('Error adding reports to map:', error);
    }
  };

  // Toggle reports visibility
  const toggleReportsVisibility = () => {
    if (!mapInstance.current || !reportsLayerRef.current) return;

    if (reportsVisible) {
      if (mapInstance.current.hasLayer(reportsLayerRef.current)) {
        mapInstance.current.removeLayer(reportsLayerRef.current);
      }
    } else {
      if (reportsLayerRef.current) {
        reportsLayerRef.current.addTo(mapInstance.current);
      }
    }
    setReportsVisible(!reportsVisible);
  };

  // Update report filter
  const updateReportFilter = (filter) => {
    setReportFilter(filter);
    // Reload reports with new filter
    if (reports.length > 0) {
      addReportsToMap(reports);
    }
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

  // Change simulation speed
  const changeSimulationSpeed = () => {
    const speeds = [1, 2, 5, 10];
    const currentIndex = speeds.indexOf(simulationSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSimulationSpeed(speeds[nextIndex]);
    
    // Restart simulation with new speed
    if (isSimulating) {
      setIsSimulating(false);
      setTimeout(() => setIsSimulating(true), 100);
    }
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
        },
        // New vessel that navigates close to protected areas
        {
          mmsi: '555666777',
          name: 'Coastal Guardian',
          type: 'naval',
          speed: 12.5,
          route: getOceanRoute('protected_area_route'),
          currentWaypoint: 0,
          lat: 32.0,
          lon: -120.0,
          heading: 45,
          status: 'underway',
          destination: 'Los Angeles',
          flag: 'USA'
        },
        // Additional vessel near Suez Canal protected area
        {
          mmsi: '666777888',
          name: 'Suez Mariner',
          type: 'container',
          speed: 15.0,
          route: getOceanRoute('suez_canal_route'),
          currentWaypoint: 0,
          lat: 31.2,
          lon: 29.9,
          heading: 120,
          status: 'underway',
          destination: 'Dubai',
          flag: 'Egypt'
        },
        // Additional vessel near Malacca Strait protected area
        {
          mmsi: '777888999',
          name: 'Malacca Trader',
          type: 'cargo',
          speed: 13.5,
          route: getOceanRoute('malacca_strait_route'),
          currentWaypoint: 0,
          lat: 1.3,
          lon: 103.8,
          heading: 330,
          status: 'underway',
          destination: 'Bangkok',
          flag: 'Singapore'
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
            color: vessel.type === 'tanker' ? '#f39c12' : 
                   vessel.type === 'container' ? '#9b59b6' :
                   vessel.type === 'cruise' ? '#1abc9c' : '#3498db',
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
              // Reset alert tracking when vessel completes its route
              const alertKey = `${vessel.mmsi}-${vessel.currentWaypoint}`;
              if (alertedVesselsRef.current.has(alertKey)) {
                alertedVesselsRef.current.delete(alertKey);
              }
              
              return {
                ...vessel,
                currentWaypoint: 0,
                lat: route[0][0],
                lon: route[0][1]
              };
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

            const speed = 0.02 * simulationSpeed;
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

            // Check for proximity to protected zones
            const zoneAlerts = checkZoneProximity(
              {...vessel, lat: newLat, lon: newLon}, 
              sensitiveZones
            );
            
            // Add alerts if any
            zoneAlerts.forEach(alert => addAlert(alert));

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
      const intervalTime = 3000 / simulationSpeed;
      intervalRef.current = setInterval(updateVesselPositions, intervalTime);
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
  }, [isSimulating, mapInitialized, error, simulationSpeed]);

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
            <div>Loading Maritime Map with Smart Zone Display...</div>
          </div>
        </div>
      )}

      {/* Alert notifications */}
      {alerts.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxWidth: '400px',
          width: '90%'
        }}>
          {alerts.map(alert => (
            <div
              key={alert.id}
              style={{
                background: alert.severity === 'critical' ? 
                  'linear-gradient(135deg, #dc3545, #c82333)' : 
                  alert.severity === 'high' ? 
                  'linear-gradient(135deg, #fd7e14, #e9690c)' : 
                  'linear-gradient(135deg, #ffc107, #e6b400)',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                animation: 'slideIn 0.3s ease-out'
              }}
            >
              <Bell size={20} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                  {alert.vessel} near {alert.zone}
                </div>
                <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                  {alert.distance} km away • {alert.severity.toUpperCase()} risk
                </div>
              </div>
              <button
                onClick={() => removeAlert(alert.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Dismiss alert"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Collapsible Control Panel - Top Left */}
      <div style={{
        position: 'absolute',
        top: alerts.length > 0 ? 'calc(1rem + ' + (alerts.length * 80) + 'px)' : '1rem',
        left: '1rem',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {/* Toggle Controls Button */}
        <button
          onClick={() => setShowControls(!showControls)}
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
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            color: '#333'
          }}
          title={showControls ? 'Hide Controls' : 'Show Controls'}
        >
          <Settings size={18} />
        </button>

        {/* Main Controls Container */}
        {showControls && (
          <div style={{
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
                  fontSize: '0.875rem',
                  flex: 1
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
                  fontSize: '0.875rem',
                  flex: 1
                }}
              >
                Reset
              </button>
            </div>

            {/* Simulation Speed Control */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <Gauge size={16} style={{ marginRight: '0.5rem' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Simulation Speed</span>
              </div>
              <button
                onClick={changeSimulationSpeed}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  width: '100%'
                }}
              >
                {simulationSpeed}x Speed
              </button>
            </div>

            <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '1rem' }}>
              <div>Vessels: {vessels.length}</div>
              <div style={{ color: isSimulating ? '#28a745' : '#dc3545' }}>
                {isSimulating ? 'Active' : 'Paused'}
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Zoom: {currentZoom} • {currentZoom >= 5 ? 'Detailed View' : 'Overview'}
              </div>
            </div>

            {/* Environmental Zones Control */}
            <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '1rem' }}>
              <h5 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50', display: 'flex', alignItems: 'center' }}>
                <Shield size={16} style={{ marginRight: '0.5rem' }} />
                Smart Zone Display
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
                {sensitiveZones.length} zones loaded<br/>
                {currentZoom >= 5 ? 'Showing circles' : 'Showing icons'}
              </div>
            </div>

            {/* Reports Control */}
            <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '1rem', marginTop: '1rem' }}>
              <h5 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50', display: 'flex', alignItems: 'center' }}>
                <AlertCircle size={16} style={{ marginRight: '0.5rem' }} />
                Marine Reports
              </h5>
              
              <button
                onClick={toggleReportsVisibility}
                disabled={loadingReports}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: reportsVisible ? '#10b981' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loadingReports ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  justifyContent: 'center',
                  marginBottom: '0.5rem'
                }}
              >
                {reportsVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                {loadingReports ? 'Loading...' : (reportsVisible ? 'Hide Reports' : 'Show Reports')}
              </button>

              {/* Report Filter */}
              <div style={{ fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: '500', color: '#495057' }}>
                Filter by type:
              </div>
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
                <button
                  onClick={() => updateReportFilter('all')}
                  style={{
                    flex: 1,
                    padding: '0.375rem 0.5rem',
                    backgroundColor: reportFilter === 'all' ? '#3b82f6' : '#e9ecef',
                    color: reportFilter === 'all' ? 'white' : '#495057',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  All
                </button>
                <button
                  onClick={() => updateReportFilter('hotspot')}
                  style={{
                    flex: 1,
                    padding: '0.375rem 0.5rem',
                    backgroundColor: reportFilter === 'hotspot' ? '#10b981' : '#e9ecef',
                    color: reportFilter === 'hotspot' ? 'white' : '#495057',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  🐟 Wildlife
                </button>
                <button
                  onClick={() => updateReportFilter('pollution')}
                  style={{
                    flex: 1,
                    padding: '0.375rem 0.5rem',
                    backgroundColor: reportFilter === 'pollution' ? '#ef4444' : '#e9ecef',
                    color: reportFilter === 'pollution' ? 'white' : '#495057',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  🛢️ Pollution
                </button>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                {reports.length} reports loaded
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Environmental Zones Legend - Bottom Left */}
      {zonesVisible && sensitiveZones.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          zIndex: 1000,
          background: 'rgba(255,255,255,0.95)',
          padding: '0.75rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          maxWidth: '240px'
        }}>
          <h5 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50', display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
            <Leaf size={14} style={{ marginRight: '0.5rem' }} />
            {currentZoom >= 5 ? 'Zone Risk Levels' : 'Zone Icons'}
          </h5>
          
          <div style={{ fontSize: '0.7rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.3rem' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#dc3545', 
                marginRight: '0.5rem', 
                borderRadius: currentZoom >= 5 ? '50%' : '2px',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8px'
              }}>
                {currentZoom < 5 ? '🚫' : ''}
              </div>
              <span>Critical {currentZoom >= 5 ? '(Pulsing)' : '(Red Icons)'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.3rem' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#fd7e14', 
                marginRight: '0.5rem', 
                borderRadius: currentZoom >= 5 ? '50%' : '2px',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8px'
              }}>
                {currentZoom < 5 ? '⚠️' : ''}
              </div>
              <span>High {currentZoom >= 5 ? '(Dashed)' : '(Orange Icons)'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.3rem' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#ffc107', 
                marginRight: '0.5rem', 
                borderRadius: currentZoom >= 5 ? '50%' : '2px',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8px'
              }}>
                {currentZoom < 5 ? '⚡' : ''}
              </div>
              <span>Medium {currentZoom >= 5 ? '(Solid)' : '(Yellow Icons)'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#28a745', 
                marginRight: '0.5rem', 
                borderRadius: currentZoom >= 5 ? '50%' : '2px',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8px'
              }}>
                {currentZoom < 5 ? '🛡️' : ''}
              </div>
              <span>Low {currentZoom >= 5 ? '(Thin)' : '(Green Icons)'}</span>
            </div>
          </div>
          <div style={{ fontSize: '0.65rem', color: '#6c757d', marginTop: '0.5rem', fontStyle: 'italic' }}>
            {currentZoom >= 5 ? 'Click circles for info' : 'Click icons for details'}
          </div>
        </div>
      )}

      {/* Map Zoom Controls - Bottom Right */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
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

      {/* Vessel List Toggle Button - Top Right */}
      <div style={{
        position: 'absolute',
        top: alerts.length > 0 ? 'calc(1rem + ' + (alerts.length * 80) + 'px)' : '1rem',
        right: '1rem',
        zIndex: 1000
      }}>
        <button
          onClick={() => setShowVesselList(!showVesselList)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(255,255,255,0.95)',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            color: '#333',
            fontSize: '0.875rem'
          }}
        >
          <Navigation size={16} />
          Vessels ({vessels.length})
          {showVesselList ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Vessel List - Only shown when toggled */}
        {showVesselList && vessels.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            width: '250px',
            maxHeight: '300px',
            overflowY: 'auto',
            marginTop: '0.5rem'
          }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#2c3e50', fontSize: '1rem' }}>Active Vessels</h4>
            
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
                <div style={{ color: '#6c757d', fontSize: '0.75rem' }}>
                  {vessel.speed.toFixed(1)} kn • {vessel.type}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Environmental Zones Info Toggle Button - Right Side */}
      <div style={{
        position: 'absolute',
        top: showVesselList ? 'calc(' + (alerts.length > 0 ? '1rem + ' + (alerts.length * 80) + 'px + 50px + 300px' : '1rem + 50px + 300px') + ')' : 
              (alerts.length > 0 ? 'calc(1rem + ' + (alerts.length * 80) + 'px + 50px)' : 'calc(1rem + 50px)'),
        right: '1rem',
        zIndex: 1000
      }}>
        <button
          onClick={() => setShowZoneInfo(!showZoneInfo)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(255,255,255,0.95)',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            color: '#333',
            fontSize: '0.875rem'
          }}
        >
          <MapPin size={16} />
          Protected Areas
          {showZoneInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Environmental Zones Info Panel - Only shown when toggled */}
        {showZoneInfo && zonesVisible && sensitiveZones.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            width: '280px',
            maxHeight: '280px',
            overflowY: 'auto',
            marginTop: '0.5rem'
          }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#2c3e50', fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
              <Fish size={18} style={{ marginRight: '0.5rem' }} />
              Protected Areas
            </h4>
            
            {sensitiveZones.slice(0, 5).map(zone => (
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
                  if (mapInstance.current && zone.center) {
                    const L = window.L;
                    // Calculate appropriate zoom level based on radius
                    const zoomLevel = zone.radius > 200000 ? 4 : zone.radius > 100000 ? 5 : 6;
                    mapInstance.current.setView(zone.center, zoomLevel);
                  }
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  {zone.name.length > 25 ? zone.name.substring(0, 25) + '...' : zone.name}
                </div>
                <div style={{ color: '#6c757d', marginBottom: '0.25rem' }}>
                  {zone.type.replace(/_/g, ' ').toUpperCase()} • {zone.severity.toUpperCase()}
                </div>
                <div style={{ color: '#495057', fontSize: '0.7rem' }}>
                  Radius: {(zone.radius / 1000).toFixed(0)} km
                </div>
              </div>
            ))}
            
            {sensitiveZones.length > 5 && (
              <div style={{ fontSize: '0.75rem', color: '#6c757d', textAlign: 'center', fontStyle: 'italic' }}>
                +{sensitiveZones.length - 5} more zones...
              </div>
            )}
          </div>
        )}
      </div>

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

      {/* Add CSS for alert animation */}
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateY(-100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default ShipMapWithZones;