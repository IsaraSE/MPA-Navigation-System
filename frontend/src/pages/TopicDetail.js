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
  const [showDocumentary, setShowDocumentary] = useState(false);

  // Topics Data
  const topics = [
    {
      id: 1,
      title: 'Marine Protected Areas',
      subtitle: 'Understanding conservation zones',
      color: '#10b981',
      description: 'Learn about different types of MPAs.',
      readTime: '5 min read',
      video: 'https://youtu.be/fnz-JszBVNM?si=nMykJXyuQZdu_Zqs' ,// ✅ Make sure this file exists in your public/videos folder
      longDescription:`As areas of protected marine biodiversity expand, there has been an increase in ocean science funding, essential for preserving marine resources.[11] In 2020, only around 7.5 to 8% of the global ocean area falls under a conservation designation.[12] This area is equivalent to 27 million square kilometres, equivalent to the land areas of Russia and Canada combined, although some argue that the effective conservation zones (ones with the strictest regulations) occupy only 5% of the ocean area (about equivalent to the land area of Russia alone). Marine conservation zones, as with their terrestrial equivalents, vary in terms of rules and regulations. Few zones rule out completely any sort of human activity within their area, as activities such as fishing, tourism, and transport of essential goods and services by ship, are part of the fabric of nation states.History
The form of marine protected areas trace the origins to the World Congress on National Parks in 1962. In 1976, a process was delivered to the excessive rights to every sovereign state to establish marine protected areas at over 200 nautical miles.

Over the next two decades, a scientific body of evidence marked the utility in the designation of marine protected areas. In the aftermath of the 1992 Earth Summit in Rio de Janeiro, an international target was established with the encompassment of ten percent of the world's marine protected areas.

On 28 October 2016 in Hobart, Australia, the Convention for the Conservation of Antarctic Marine Living Resources agreed to establish the first Antarctic and largest marine protected area in the world encompassing 1.55 million km2 (600,000 sq mi) in the Ross Sea.[18] Other large MPAs are in the Indian, Pacific, and Atlantic Oceans, in certain exclusive economic zones of Australia and overseas territories of France, the United Kingdom and the United States, with major (990,000 square kilometres (380,000 sq mi) or larger) new or expanded MPAs by these nations since 2012—such as Natural Park of the Coral Sea, Pacific Islands Heritage Marine National Monument, Coral Sea Commonwealth Marine Reserve and South Georgia and the South Sandwich Islands Marine Protected Area.

When counted with MPAs of all sizes from many other countries, as of April 2023 there are more than 16,615 MPAs, encompassing 7.2% of the world's oceans (26,146,645 km2), with less than half of that area – encompassing 2.9% of the world's oceans – assessed to be fully or highly protected according to the MPA Guide Framework.[19] Efforts to reach the 10% target by 2020 were not met, but a new target of 30% of the world's oceans protected by 2030 has been proposed and is under consideration by the Convention on Biological Diversity.[20]`,
    },
  ];

  const topic = topics.find(t => t.id === topicId) || topics[0];

  const IconComponent = useMemo(() => {
    const icons = { 1: Shield, 2: Fish, 3: Anchor, 4: Waves, 5: FileText, 6: Globe };
    return icons[topic.id] || Shield;
  }, [topic.id]);

  // Handlers
  const handleBackPress = () => navigate('/eco-compliance-hub');
  const handleVideoPress = () => alert('Play video functionality not implemented yet.');
  const handleMoreInfoVideo = () => {
  setShowDocumentary(prev => !prev); // toggle documentary panel
};
  const handleTakeAction = () => navigate('/quiz/:quizId');

  // Detailed content
  const getDetailedContent = (id) => {
    const contents = {
      1: `A marine protected area (MPA) is a protected area of the world's seas, oceans, estuaries or in the US, the Great Lakes. These marine areas can come in many forms ranging from wildlife refuges to research facilities.MPAs restrict human activity for a conservation purpose, typically to protect natural or cultural resources. Such marine resources are protected by local, state, territorial, native, regional, national, or international authorities and differ substantially among and between nations. This variation includes different limitations on development, fishing practices, fishing seasons and catch limits, moorings and bans on removing or disrupting marine life. MPAs can provide economic benefits by supporting the fishing industry through the revival of fish stocks, as well as job creation and other market benefits via ecotourism. MPAs can provide value to mobile species.
There are a number of global examples of large marine conservation areas. The Papahānaumokuākea Marine National Monument, is situated in the central Pacific Ocean, around Hawaii, occupying an area of 1.5 million square kilometers. The area is rich in wild life, including the green turtle and the Hawaiian monkfish, alongside 7,000 other species, and 14 million seabirds. In 2017 the Cook Islands passed the Marae Moana Act designating the whole of the country's marine exclusive economic zone, which has an area of 1.9 million square kilometers as a zone with the purpose of protecting and conserving the "ecological, biodiversity and heritage values of the Cook Islands marine environment". Other large marine conservation areas include those around Antarctica, New Caledonia, Greenland, Alaska, Ascension Island, and Brazil..`,
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
      {/* Header */}
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 pt-6 pb-24">
        
        {/* Back Button */}
        <div
          className="flex items-center mb-6 text-gray-600 hover:text-gray-800 cursor-pointer"
          onClick={handleBackPress}
        >
          <ArrowLeft size={20} />
          <span className="ml-2 font-medium">Back to Hub</span>
        </div>

        {/* Hero Section */}
        <section 
    className="relative mb-6 w-full h-64 rounded-2xl overflow-hidden">
  <iframe
    className="w-full h-full"
    src={`https://www.youtube.com/embed/${topic.video.split('youtu.be/')[1].split('?')[0]}`}
    title={topic.title}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />




          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-4 rounded-xl mr-4 flex items-center justify-center">
              <IconComponent size={32} color={topic.color} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{topic.title}</h2>
              <p className="text-gray-500">{topic.subtitle}</p>
            </div>
          </div>

          <div className="flex justify-between items-center text-gray-500 text-sm">
            <div className="flex items-center space-x-2"><Clock size={16} /><span>{topic.readTime}</span></div>
            <div className="flex items-center space-x-2"><Eye size={16} /><span>2.3k views</span></div>
            <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-700 transition"><Share size={16} /><span>Share</span></div>
          </div>
        </section>

        {/* Topic Overview */}
        <section className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex items-center mb-3">
            <BookOpen size={24} />
            <span className="ml-2 font-bold text-lg text-gray-800">Topic Overview</span>
          </div>
          <p className="text-gray-600 leading-relaxed">{topic.description}</p>
        </section>

        {/* Detailed Section */}
        <section className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Comprehensive Guide</h3>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {getDetailedContent(topic.id)}
          </p>
        </section>

        {/* Video Link Section */}
        {/* Read Detailed Documentary (documentary = long text, separate from video) */}
<section
  className="bg-white rounded-2xl shadow p-4 mb-10 hover:bg-gray-50 transition-all duration-300 cursor-pointer"
  onClick={handleMoreInfoVideo}
>
  <div className="flex items-center">
    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
      <ExternalLink size={24} color="#3b82f6" />
    </div>
    <div className="flex-1">
      <p className="font-semibold text-gray-800">
        {showDocumentary ? 'Hide Documentary' : 'Read Detailed Documentary'}
      </p>
      <p className="text-gray-500 text-sm">
        Explore more insights with expert interviews and real-world examples.
      </p>
    </div>
    <ChevronRight
      size={20}
      color="#9ca3af"
      className={`transform transition-transform duration-300 ${showDocumentary ? 'rotate-90' : ''}`}
    />
  </div>

  {/* Expanded documentary text (inline) */}
  {showDocumentary && (
    <div className="mt-4 border-t border-gray-200 pt-4 text-gray-700 leading-relaxed text-sm transition-all duration-500 ease-in-out">
      <p className="whitespace-pre-line">
        {topic.longDescription || getDetailedContent(topic.id)}
      </p>
    </div>
  )}
</section>


        <Footer />
      </main>

      {/* Take Action Button */}
      <button
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 transition text-white px-6 py-3 rounded-full flex items-center space-x-2 shadow-xl"
        onClick={handleTakeAction}
      >
        <AlertCircle size={20} />
        <span>Take Action</span>
      </button>
    </div>
  );
};

export default TopicDetail;
