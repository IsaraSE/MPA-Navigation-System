import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Leaf,
  Fish,
  Anchor,
  AlertTriangle,
  BookOpen,
  Award,
  Users,
  Globe,
  Camera,
  MapPin,
  Waves,
  Shield,
  Info,
  ChevronRight,
  PlayCircle,
  FileText,
  Clock,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const EcoComplianceHub = () => {
  const [activeSection, setActiveSection] = useState('education');
  const [headerOpacity, setHeaderOpacity] = useState(1);
  const navigate = useNavigate();

  const handleTopicClick = (topic) => {
    // Fixed navigation: pass topicId to TopicDetail
    navigate('/topic/:topicParam-detail', { state: { topicId: topic.id } });
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const min = 0;
      const max = 100;
      const t = Math.max(0, Math.min(1, (y - min) / (max - min)));
      setHeaderOpacity(1 - t * 0.1); // from 1 to 0.9
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const educationalTopics = useMemo(
    () => [
      {
        id: 1,
        title: 'Marine Protected Areas',
        subtitle: 'Understanding conservation zones',
        icon: Shield,
        color: '#10b981',
        gradient: ['#10b981', '#059669'],
        description: 'Learn about different types of MPAs, their boundaries, and protection levels.',
        readTime: '5 min read',
        image: '/mpa.jpg',
      },
      {
        id: 2,
        title: 'Marine Wildlife Protection',
        subtitle: 'Protecting ocean biodiversity',
        icon: Fish,
        color: '#3b82f6',
        gradient: ['#3b82f6', '#1d4ed8'],
        description: 'Discover endangered species, migration patterns, and conservation efforts.',
        readTime: '7 min read',
        image: '/wild.jpg',
      },
      {
        id: 3,
        title: 'Sustainable Fishing Practices',
        subtitle: 'Responsible fishing guidelines',
        icon: Anchor,
        color: '#f5e90bff',
        gradient: ['#d6f50bff', '#d9d206ff'],
        description: 'Best practices for sustainable fishing and marine resource management.',
        readTime: '6 min read',
        image: '/fishing.jpg',
      },
      {
        id: 4,
        title: 'Ocean Pollution Prevention',
        subtitle: 'Keeping our oceans clean',
        icon: Waves,
        color: '#06b6d4',
        gradient: ['#06b6d4', '#0891b2'],
        description: 'Understanding pollution sources and prevention strategies.',
        readTime: '4 min read',
        image: '/nav4.jpg',
      },
      {
        id: 5,
        title: 'Compliance Regulations',
        subtitle: 'Maritime laws & guidelines',
        icon: FileText,
        color: '#8b5cf6',
        gradient: ['#8b5cf6', '#7c3aed'],
        description: 'International and local regulations for marine conservation.',
        readTime: '8 min read',
        image: '/anchor.jpg',
      },
      {
        id: 6,
        title: 'Climate Change Impact',
        subtitle: 'Ocean warming & acidification',
        icon: Globe,
        color: '#ef4444',
        gradient: ['#ef4444', '#dc2626'],
        description: 'How climate change affects marine ecosystems and biodiversity.',
        readTime: '9 min read',
        image: '/nav6.jpg',
      },
    ],
    []
  );

  const stats = useMemo(
    () => [
      { label: 'Protected Areas', value: '15,000+', icon: Shield },
      { label: 'Species Protected', value: '8,500+', icon: Fish },
      { label: 'Active Users', value: '25,000+', icon: Users },
      { label: 'Educational Resources', value: '200+', icon: BookOpen },
    ],
    []
  );

  const handleQuickAction = (action) => {
    console.log('Quick action:', action);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div
        className="sticky top-0 z-30"
        style={{ background: `rgba(255,255,255,${headerOpacity})`, transition: 'background 150ms' }}
      >
        <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Card */}
        <section className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="h-1" style={{ background: '#10b981' }} />
          <div className="p-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Leaf size={40} />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-4">
              Eco-Compliance & Awareness Hub
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto leading-7">
              Learn, protect, and preserve our marine ecosystems through education and responsible
              practices
            </p>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-xl flex flex-col items-center">
                  <s.icon size={20} />
                  <div className="font-bold text-lg mt-2">{s.value}</div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Header */}
        <section className="mb-4">
          <div className="flex items-center space-x-3 mb-2">
            <BookOpen size={20} />
            <h2 className="text-xl font-bold">Featured Learning Topics</h2>
          </div>
          <p className="text-sm text-gray-600">
            Explore comprehensive guides on marine conservation and compliance
          </p>
        </section>

        {/* Topics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {educationalTopics.map((topic) => (
            <article
              key={topic.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleTopicClick(topic)}
            >
              <div className="h-2" style={{ background: topic.gradient[0] }} />
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ background: `${topic.color}20` }}
                  >
                    <topic.icon size={20} color={topic.color} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                    <p className="text-sm text-gray-500">{topic.subtitle}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>

                <div className="mt-4 rounded-lg bg-gray-100 h-40 flex items-center justify-center">
                  <img
                    src={topic.image}
                    alt={topic.title}
                    className="object-cover w-full h-full rounded-md"
                    loading="lazy"
                  />
                </div>

                <p className="mt-4 text-sm text-gray-600">{topic.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={14} />
                    <span className="ml-2">{topic.readTime}</span>
                  </div>

                  <div
                    className="px-3 py-1 rounded-md font-semibold text-sm"
                    style={{ background: `${topic.color}15`, color: topic.color }}
                  >
                    Learn More
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="mb-16">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => handleQuickAction('videos')}
              className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md"
            >
              <PlayCircle size={24} />
              <span className="text-xs mt-2 font-medium">Watch Videos</span>
            </button>
            <button
              onClick={() => handleQuickAction('quiz')}
              className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md"
            >
              <Award size={24} />
              <span className="text-xs mt-2 font-medium">Take Quiz</span>
            </button>
            <button
              onClick={() => handleQuickAction('maps')}
              className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md"
            >
              <MapPin size={24} />
              <span className="text-xs mt-2 font-medium">Find MPAs</span>
            </button>
            <button
              onClick={() => handleQuickAction('report')}
              className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md"
            >
              <AlertTriangle size={24} />
              <span className="text-xs mt-2 font-medium">Report Issue</span>
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EcoComplianceHub;
