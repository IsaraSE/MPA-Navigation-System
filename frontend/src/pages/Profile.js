import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import reportService from '../services/reportService';
import FormCard from '../components/FormCard';
import TextBox from '../components/TextBox';
import SelectBox from '../components/SelectBox';
import Button from '../components/Button';
import { 
  MdPerson, 
  MdEmail, 
  MdDirectionsBoat, 
  MdInventory, 
  MdGroup, 
  MdEdit, 
  MdSave, 
  MdCancel,
  MdRefresh,
  MdSecurity,
  MdCalendarToday,
  MdVerified,
  MdDirectionsBoatFilled,
  MdLocationOn,
  MdDelete,
  MdVisibility,
  MdPets,
  MdWater,
  MdWarning,
  MdTrendingUp,
  MdAssessment,
  MdMap,
  MdSettings,
  MdLogout
} from 'react-icons/md';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myReports, setMyReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      vesselName: user?.vesselName || '',
      vesselType: user?.vesselType || '',
      role: user?.role || ''
    }
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        vesselName: user.vesselName || '',
        vesselType: user.vesselType || '',
        role: user.role || ''
      });
    }
  }, [user, reset]);

  // Load user's reports
  useEffect(() => {
    const fetchMyReports = async () => {
      if (!user) return;
      
      try {
        setLoadingReports(true);
        const data = await reportService.getMyReports();
        setMyReports(data.reports || []);
      } catch (error) {
        console.error('Error loading reports:', error);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchMyReports();
  }, [user]);

  const vesselTypes = [
    { value: 'cargo', label: 'Cargo' },
    { value: 'fishing', label: 'Fishing' },
    { value: 'pleasure', label: 'Pleasure' },
    { value: 'tanker', label: 'Tanker' },
    { value: 'passenger', label: 'Passenger' },
    { value: 'other', label: 'Other' }
  ];

  const roles = [
    { value: 'sailor', label: 'Sailor' },
    { value: 'captain', label: 'Captain' },
    { value: 'admin', label: 'Admin' }
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      await reportService.deleteReport(reportId);
      toast.success('Report deleted successfully');
      setMyReports(myReports.filter(r => r._id !== reportId));
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalReports: myReports.length,
    hotspotReports: myReports.filter(r => r.type === 'hotspot').length,
    pollutionReports: myReports.filter(r => r.type === 'pollution').length,
    thisMonth: myReports.filter(r => {
      const reportDate = new Date(r.createdAt);
      const currentDate = new Date();
      return reportDate.getMonth() === currentDate.getMonth() && 
             reportDate.getFullYear() === currentDate.getFullYear();
    }).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 opacity-5">
          <MdDirectionsBoat className="w-32 h-32 text-blue-600 transform rotate-12" />
        </div>
        <div className="absolute bottom-20 right-1/4 opacity-5">
          <MdDirectionsBoatFilled className="w-24 h-24 text-cyan-600 transform -rotate-12" />
        </div>
        <div className="absolute top-1/2 left-10 opacity-3">
          <MdMap className="w-16 h-16 text-blue-600" />
        </div>
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Maritime Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.name}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => navigate('/report')}
                  variant="primary"
                  size="md"
                  icon={<MdLocationOn className="h-4 w-4" />}
                >
                  Submit Report
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="secondary"
                  size="md"
                  icon={<MdLogout className="h-4 w-4" />}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalReports}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MdAssessment className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <MdTrendingUp className="h-4 w-4 mr-1" />
                <span>Active contributor</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Wildlife Hotspots</p>
                  <p className="text-3xl font-bold text-green-600">{stats.hotspotReports}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <MdPets className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span>Marine life sightings</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pollution Reports</p>
                  <p className="text-3xl font-bold text-red-600">{stats.pollutionReports}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <MdWarning className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span>Environmental alerts</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.thisMonth}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MdCalendarToday className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span>Recent activity</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Avatar */}
                <div className="text-center mb-6">
                  <div className="mx-auto h-24 w-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg mb-4">
                    <span className="text-3xl font-bold text-white">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{user.name}</h3>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {user.role?.charAt(0)?.toUpperCase() + user.role?.slice(1) || 'User'}
                    </span>
                    <MdVerified className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>

                {/* Quick Info */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MdDirectionsBoat className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Vessel</p>
                      <p className="text-sm text-gray-600">{user.vesselName || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MdInventory className="h-5 w-5 text-cyan-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Type</p>
                      <p className="text-sm text-gray-600">{user.vesselType?.charAt(0)?.toUpperCase() + user.vesselType?.slice(1) || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant="primary"
                    size="lg"
                    className="w-full"
                    icon={<MdEdit className="h-4 w-4" />}
                  >
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Form */}
              {isEditing && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <MdCancel className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextBox
                        id="name"
                        label="Full Name"
                        placeholder="Enter your full name"
                        icon={<MdPerson className="h-5 w-5 text-gray-400" />}
                        register={register('name', { required: 'Name is required' })}
                        error={errors.name?.message}
                      />
                      <TextBox
                        id="email"
                        type="email"
                        label="Email Address"
                        placeholder="Enter your email"
                        icon={<MdEmail className="h-5 w-5 text-gray-400" />}
                        register={register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        error={errors.email?.message}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextBox
                        id="vesselName"
                        label="Vessel Name"
                        placeholder="Enter vessel name"
                        icon={<MdDirectionsBoat className="h-5 w-5 text-gray-400" />}
                        register={register('vesselName', { required: 'Vessel name is required' })}
                        error={errors.vesselName?.message}
                      />
                      <SelectBox
                        id="vesselType"
                        label="Vessel Type"
                        placeholder="Select vessel type"
                        icon={<MdInventory className="h-5 w-5 text-gray-400" />}
                        register={register('vesselType', { required: 'Vessel type is required' })}
                        error={errors.vesselType?.message}
                        options={vesselTypes}
                      />
                    </div>

                    <SelectBox
                      id="role"
                      label="Role"
                      placeholder="Select your role"
                      icon={<MdGroup className="h-5 w-5 text-gray-400" />}
                      register={register('role', { required: 'Role is required' })}
                      error={errors.role?.message}
                      options={roles}
                    />

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={loading}
                        icon={loading ? <MdRefresh className="animate-spin h-4 w-4" /> : <MdSave className="h-4 w-4" />}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Reports Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <MdLocationOn className="mr-2 text-blue-600" />
                      My Reports
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">Your submitted maritime reports</p>
                  </div>
                </div>

                {loadingReports ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your reports...</p>
                  </div>
                ) : myReports.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <MdLocationOn className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Reports Yet</h3>
                    <p className="text-gray-500 mb-4">Start contributing to marine conservation</p>
                    <Button
                      onClick={() => navigate('/report')}
                      variant="primary"
                      size="md"
                      icon={<MdLocationOn className="h-4 w-4" />}
                    >
                      Submit Your First Report
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myReports.map((report) => (
                      <div
                        key={report._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`p-2 rounded-full ${
                                report.type === 'hotspot' ? 'bg-green-100' : 'bg-red-100'
                              }`}>
                                {report.type === 'hotspot' ? (
                                  <MdPets className="h-5 w-5 text-green-600" />
                                ) : (
                                  <MdWater className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                                <div className="flex gap-2 mt-1">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    report.type === 'hotspot'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {report.type === 'hotspot' ? 'Wildlife Hotspot' : 'Pollution'}
                                  </span>
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                    report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                                    report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                    {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {report.species && (
                              <div className="mb-2">
                                <span className="text-sm font-medium text-gray-700">Species: </span>
                                <span className="text-sm text-gray-600">{report.species}</span>
                              </div>
                            )}

                            <p className="text-sm text-gray-600 mb-3 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                              {report.description}
                            </p>

                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <MdLocationOn className="h-4 w-4 mr-1" />
                                <span>
                                  {report.location.coordinates[1].toFixed(4)}, {report.location.coordinates[0].toFixed(4)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <MdCalendarToday className="h-4 w-4 mr-1" />
                                <span>
                                  {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleDeleteReport(report._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete report"
                            >
                              <MdDelete className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;