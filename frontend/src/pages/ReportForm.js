import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import reportService from '../services/reportService';
import FormCard from '../components/FormCard';
import PageHeader from '../components/PageHeader';
import TextBox from '../components/TextBox';
import SelectBox from '../components/SelectBox';
import Button from '../components/Button';
import { 
  MdLocationOn, 
  MdDescription, 
  MdTitle,
  MdWarning,
  MdSave,
  MdCancel,
  MdMyLocation,
  MdPets,
  MdWater,
  MdImage
} from 'react-icons/md';

const ReportForm = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('hotspot');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues: {
      type: 'hotspot',
      title: '',
      description: '',
      species: '',
      severity: 'medium',
      latitude: '',
      longitude: '',
      imageUrl: ''
    }
  });

  const watchedType = watch('type');

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to submit a report');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      // Wait for Leaflet to load
      if (!window.L) {
        // Load Leaflet if not already loaded
        if (!document.querySelector('link[href*="leaflet"]')) {
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
          document.head.appendChild(cssLink);
        }

        if (!document.querySelector('script[src*="leaflet"]')) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
          script.onload = () => {
            setTimeout(() => initializeLeafletMap(), 200);
          };
          document.head.appendChild(script);
        }
      } else {
        initializeLeafletMap();
      }
    };

    const initializeLeafletMap = () => {
      if (!mapRef.current || mapInstance.current) return;

      const L = window.L;
      
      mapInstance.current = L.map(mapRef.current).setView([20, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstance.current);

      // Click event to select location
      mapInstance.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setSelectedLocation({ lat, lng });
        setValue('latitude', lat.toFixed(6));
        setValue('longitude', lng.toFixed(6));

        // Add or update marker
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          const icon = L.divIcon({
            className: 'custom-map-marker',
            html: `
              <div style="
                background: linear-gradient(135deg, #3b82f6, #1e40af);
                width: 40px;
                height: 40px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid white;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div style="
                  transform: rotate(45deg);
                  color: white;
                  font-size: 20px;
                ">📍</div>
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
          });

          markerRef.current = L.marker([lat, lng], { icon })
            .addTo(mapInstance.current)
            .bindPopup('Report Location');
        }

        markerRef.current.openPopup();
      });

      setMapInitialized(true);
    };

    if (mapRef.current) {
      initMap();
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [setValue]);

  // Get current location
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      toast.loading('Getting your location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ lat: latitude, lng: longitude });
          setValue('latitude', latitude.toFixed(6));
          setValue('longitude', longitude.toFixed(6));

          if (mapInstance.current) {
            mapInstance.current.setView([latitude, longitude], 8);
            
            if (markerRef.current) {
              markerRef.current.setLatLng([latitude, longitude]);
            }
          }

          toast.dismiss();
          toast.success('Location updated!');
        },
        (error) => {
          toast.dismiss();
          toast.error('Unable to get your location. Please click on the map.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const severityOptions = [
    { value: 'low', label: 'Low - Minor concern' },
    { value: 'medium', label: 'Medium - Moderate attention needed' },
    { value: 'high', label: 'High - Significant concern' },
    { value: 'critical', label: 'Critical - Immediate action required' }
  ];

  const onSubmit = async (data) => {
    if (!selectedLocation) {
      toast.error('Please select a location on the map');
      return;
    }

    setLoading(true);
    try {
      await reportService.createReport(data);
      toast.success(`${data.type === 'hotspot' ? 'Wildlife hotspot' : 'Pollution'} report submitted successfully!`);
      reset();
      setSelectedLocation(null);
      if (markerRef.current) {
        mapInstance.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      
      // Navigate to home or profile after short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(error.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <PageHeader
          title="Submit Marine Report"
          subtitle="Help protect our oceans by reporting wildlife sightings or pollution incidents"
          icon={<MdLocationOn className="h-12 w-12 text-white" />}
          className="mb-8"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <FormCard className="p-8 h-fit">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Details</h2>
              <p className="text-gray-600 text-sm">Fill in the information about what you've observed</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Report Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Report Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setReportType('hotspot');
                      setValue('type', 'hotspot');
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      watchedType === 'hotspot'
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <MdPets className={`h-8 w-8 mx-auto mb-2 ${
                      watchedType === 'hotspot' ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className={`font-semibold ${
                      watchedType === 'hotspot' ? 'text-blue-900' : 'text-gray-700'
                    }`}>
                      Wildlife Hotspot
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Marine animal sightings
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setReportType('pollution');
                      setValue('type', 'pollution');
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      watchedType === 'pollution'
                        ? 'border-red-600 bg-red-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-red-300'
                    }`}
                  >
                    <MdWater className={`h-8 w-8 mx-auto mb-2 ${
                      watchedType === 'pollution' ? 'text-red-600' : 'text-gray-400'
                    }`} />
                    <div className={`font-semibold ${
                      watchedType === 'pollution' ? 'text-red-900' : 'text-gray-700'
                    }`}>
                      Pollution
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Oil spills, debris, etc.
                    </div>
                  </button>
                </div>
                <input type="hidden" {...register('type')} />
              </div>

              {/* Title */}
              <TextBox
                id="title"
                label="Title"
                placeholder="e.g., Whale pod sighting or Oil spill detected"
                icon={<MdTitle className="h-5 w-5 text-gray-400" />}
                register={register('title', { 
                  required: 'Title is required',
                  maxLength: { value: 100, message: 'Title must not exceed 100 characters' }
                })}
                error={errors.title?.message}
              />

              {/* Species (only for hotspot) */}
              {watchedType === 'hotspot' && (
                <TextBox
                  id="species"
                  label="Species"
                  placeholder="e.g., Humpback Whale, Dolphin, Sea Turtle"
                  icon={<MdPets className="h-5 w-5 text-gray-400" />}
                  register={register('species', { 
                    required: watchedType === 'hotspot' ? 'Species is required for wildlife hotspot' : false,
                    maxLength: { value: 100, message: 'Species name must not exceed 100 characters' }
                  })}
                  error={errors.species?.message}
                />
              )}

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3">
                    <MdDescription className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="description"
                    rows="4"
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Provide detailed information about what you observed..."
                    {...register('description', { 
                      required: 'Description is required',
                      maxLength: { value: 1000, message: 'Description must not exceed 1000 characters' }
                    })}
                  />
                </div>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              {/* Severity */}
              <SelectBox
                id="severity"
                label="Severity Level"
                placeholder="Select severity level"
                icon={<MdWarning className="h-5 w-5 text-gray-400" />}
                register={register('severity', { required: 'Severity is required' })}
                error={errors.severity?.message}
                options={severityOptions}
              />

              {/* Location Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <TextBox
                  id="latitude"
                  label="Latitude"
                  placeholder="Click map to set"
                  type="number"
                  step="any"
                  icon={<MdLocationOn className="h-5 w-5 text-gray-400" />}
                  register={register('latitude', { 
                    required: 'Latitude is required',
                    min: { value: -90, message: 'Invalid latitude' },
                    max: { value: 90, message: 'Invalid latitude' }
                  })}
                  error={errors.latitude?.message}
                  readOnly
                />

                <TextBox
                  id="longitude"
                  label="Longitude"
                  placeholder="Click map to set"
                  type="number"
                  step="any"
                  icon={<MdLocationOn className="h-5 w-5 text-gray-400" />}
                  register={register('longitude', { 
                    required: 'Longitude is required',
                    min: { value: -180, message: 'Invalid longitude' },
                    max: { value: 180, message: 'Invalid longitude' }
                  })}
                  error={errors.longitude?.message}
                  readOnly
                />
              </div>

              {/* Image URL (optional) */}
              <TextBox
                id="imageUrl"
                label="Image URL (optional)"
                placeholder="https://example.com/image.jpg"
                icon={<MdImage className="h-5 w-5 text-gray-400" />}
                register={register('imageUrl')}
                error={errors.imageUrl?.message}
              />

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  icon={<MdSave className="h-5 w-5" />}
                  className="flex-1"
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/')}
                  icon={<MdCancel className="h-5 w-5" />}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </FormCard>

          {/* Map Section */}
          <FormCard className="p-6 h-fit lg:sticky lg:top-8">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Select Location</h3>
              <p className="text-gray-600 text-sm mb-3">
                Click on the map to mark the exact location of your observation
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleGetCurrentLocation}
                icon={<MdMyLocation className="h-4 w-4" />}
                className="w-full"
              >
                Use My Current Location
              </Button>
            </div>

            {/* Map Container */}
            <div 
              ref={mapRef}
              className="w-full h-96 rounded-lg border-2 border-gray-200 overflow-hidden shadow-inner"
              style={{ minHeight: '400px' }}
            />

            {selectedLocation && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <MdLocationOn className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                  <div className="text-sm">
                    <div className="font-semibold text-blue-900 mb-1">Location Selected</div>
                    <div className="text-blue-700">
                      Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!selectedLocation && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <MdWarning className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                  <div className="text-sm text-yellow-800">
                    Please click on the map to select a location for your report
                  </div>
                </div>
              </div>
            )}
          </FormCard>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;

