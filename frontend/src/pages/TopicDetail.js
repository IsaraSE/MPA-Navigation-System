import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Play, Shield, Fish, Anchor, Waves, FileText, Globe,
  Clock, Eye, Share, BookOpen, AlertCircle, ChevronRight, ExternalLink
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TopicDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const topicId = location.state?.topicId || 1; 

  const [activeSection, setActiveSection] = useState('education');

 
  const topics = [
    { id: 1, title: 'Marine Protected Areas', subtitle: 'Understanding conservation zones', color: '#10b981', description: 'Learn about different types of MPAs.', readTime: '5 min read' },
   
 
  ];

  
  const topic = topics.find(t => t.id === topicId) || topics[0];

  const IconComponent = useMemo(() => {
    const icons = {
      1: Shield,
      2: Fish,
      3: Anchor,
      4: Waves,
      5: FileText,
      6: Globe
    };
    return icons[topic.id] || Shield;
  }, [topic.id]);

  // Navigation handlers
  const handleBackPress = () => navigate('/eco-compliance-hub');
  const handleVideoPress = () => alert('Play video functionality not implemented yet.');
  const handleMoreInfoVideo = () => alert('Navigate to documentary link.');
  const handleTakeAction = () => alert('Take action functionality.');

  // Detailed content function
  const getDetailedContent = (id) => {
    const contents = {
      1: `Marine Protected Areas (MPAs) are clearly defined geographical spaces, recognized, dedicated and managed...`,
      2: `Marine wildlife faces unprecedented threats in the 21st century, from climate change and pollution...`,
      3: `Sustainable fishing practices are essential for maintaining healthy marine ecosystems...`,
      4: `Ocean pollution threatens marine ecosystems, human health, and the global economy...`,
      5: `Maritime compliance regulations form the legal framework for protecting marine environments...`,
      6: `Climate change represents the greatest long-term threat to marine ecosystems...`,
    };
    return contents[id] || contents[1];
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24">
        {/* Back Button */}
        <div className="flex items-center mb-4 cursor-pointer" onClick={handleBackPress}>
          <ArrowLeft size={20} /> <span className="ml-2 font-medium">Back to Hub</span>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow p-6 mb-4 relative overflow-hidden">
          <div className="relative mb-4">
            <video
              src={topic.video}
              className="rounded-xl w-full h-64 object-cover"
              loop
              muted
              autoPlay
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center cursor-pointer" onClick={handleVideoPress}>
              <Play size={48} color="white" />
            </div>
          </div>

          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-4 rounded-xl mr-4 flex items-center justify-center">
              <IconComponent size={32} color={topic.color} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{topic.title}</h2>
              <p className="text-gray-500">{topic.subtitle}</p>
            </div>
          </div>

          <div className="flex justify-between items-center text-gray-500">
            <div className="flex items-center space-x-2"><Clock size={16} /> <span>{topic.readTime}</span></div>
            <div className="flex items-center space-x-2"><Eye size={16} /> <span>2.3k views</span></div>
            <div className="flex items-center space-x-2 cursor-pointer"><Share size={16} /> <span>Share</span></div>
          </div>
        </div>

        {/* Topic Overview */}
        <div className="bg-white rounded-2xl shadow p-6 mb-4">
          <div className="flex items-center mb-2"><BookOpen size={24} /><span className="ml-2 font-bold text-lg">Topic Overview</span></div>
          <p className="text-gray-600">{topic.description}</p>
        </div>

        {/* Detailed Section */}
        <div className="bg-white rounded-2xl shadow p-6 mb-4">
          <h3 className="text-xl font-bold mb-4">Comprehensive Guide</h3>
          <p className="text-gray-700 whitespace-pre-line">{getDetailedContent(topic.id)}</p>
        </div>

        {/* Video Link */}
        <div className="bg-white rounded-2xl shadow p-4 mb-8 cursor-pointer" onClick={handleMoreInfoVideo}>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <ExternalLink size={24} color="#3b82f6" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Watch Detailed Documentary</p>
              <p className="text-gray-500 text-sm">Explore more insights with expert interviews and real-world examples</p>
            </div>
            <ChevronRight size={20} color="#9ca3af" />
          </div>
        </div>

        <Footer />
      </div>

      {/* Take Action Button */}
      <button
        className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-3 rounded-full flex items-center space-x-2 shadow-lg"
        onClick={handleTakeAction}
      >
        <AlertCircle size={20} /> <span>Take Action</span>
      </button>
    </div>
  );
};

export default TopicDetail;
