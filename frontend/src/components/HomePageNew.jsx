import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowRight, Scale, Users, BookOpen, Shield, Smartphone, Clock, TrendingUp, HelpCircle, Phone, Search, Target, Award, Heart, Lightbulb } from 'lucide-react';
import { useLegalProcesses } from '../hooks/useApi';
import AdBanner from './AdBanner';
import Header from './Header';
import { apiService } from '../services/api';

const HomePageNew = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { data: allProcesses, loading: processesLoading } = useLegalProcesses();
  
  const [homeContent, setHomeContent] = useState(null);

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      const content = await apiService.getHomePageContent();
      setHomeContent(content);
    } catch (error) {
      console.error('Error fetching home content:', error);
      // Set fallback content
      setHomeContent({
        // Hero Section
        hero_title: 'Hukuki Süreçleri',
        hero_title_highlight: 'Görselleştiriyoruz',
        hero_subtitle: 'Karmaşık hukuki süreçleri anlaşılır görsellerle öğrenin. Vatandaşların hukuki haklarını öğrenmesi için tasarlanmış interaktif platform.',
        
        // CTA Buttons
        hero_primary_btn_text: 'Süreçleri Keşfedin',
        hero_primary_btn_url: '/hukuki-surecler',
        hero_secondary_btn_text: 'Ücretsiz Yardım Al',
        hero_secondary_btn_url: '/adli-yardim-hizmetleri',
        
        // Stats Section
        stats_processes_number: '8+',
        stats_processes_label: 'Hukuki Süreç',
        stats_processes_description: 'Boşanma, Miras, İş Davası ve daha fazlası',
        
        stats_steps_number: '35+',
        stats_steps_label: 'Detaylı Adım',
        stats_steps_description: 'Her süreç için kapsamlı açıklamalar',
        
        stats_free_number: '100%',
        stats_free_label: 'Ücretsiz',
        stats_free_description: 'Tüm içerikler tamamen ücretsiz',
        
        // Features Section
        features_title: 'Neden Legal Design Turkey?',
        features_description: 'Hukuki süreçleri herkesin anlayabileceği şekilde görselleştiriyoruz',
        
        // Bottom CTA Section
        bottom_cta_title: 'Hukuki Süreçlerinizi Bugün Öğrenin',
        bottom_cta_description: 'Boşanma, miras, iş davası ve ceza yargılaması süreçlerini interaktiv görsellerle keşfedin.',
        bottom_cta_primary_btn_text: 'Hemen Başlayın',
        bottom_cta_primary_btn_url: '/hukuki-surecler',
        bottom_cta_secondary_btn_text: 'Ücretsiz Yardım',
        bottom_cta_secondary_btn_url: '/adli-yardim-hizmetleri'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Get featured processes (first 4 from API)
  const featuredProcesses = allProcesses?.slice(0, 4) || [];

  // Icon mapping function
  const getIcon = (iconName) => {
    const iconMap = {
      Smartphone: <Smartphone className="h-8 w-8" />,
      Scale: <Scale className="h-8 w-8" />,
      Users: <Users className="h-8 w-8" />,
      BookOpen: <BookOpen className="h-8 w-8" />,
      Shield: <Shield className="h-8 w-8" />,
      Clock: <Clock className="h-8 w-8" />,
      Target: <Target className="h-8 w-8" />,
      Award: <Award className="h-8 w-8" />,
      Heart: <Heart className="h-8 w-8" />,
      Lightbulb: <Lightbulb className="h-8 w-8" />
    };
    return iconMap[iconName] || <Smartphone className="h-8 w-8" />;
  };

  // Dynamic features based on API data
  const features = homeContent?.features_items ? homeContent.features_items.map(item => ({
    icon: getIcon(item.icon),
    title: item.title,
    description: item.description
  })) : [];

  // Dynamic stats based on API data
  const processStats = homeContent ? [
    { 
      number: homeContent.stats_processes_number, 
      label: homeContent.stats_processes_label,
      description: homeContent.stats_processes_description
    },
    { 
      number: homeContent.stats_steps_number, 
      label: homeContent.stats_steps_label,
      description: homeContent.stats_steps_description
    },
    { 
      number: homeContent.stats_free_number, 
      label: homeContent.stats_free_label,
      description: homeContent.stats_free_description
    }
  ] : [];

  const quickActions = [
    {
      title: "Adli Yardım",
      description: "Ücretsiz hukuki yardım nasıl alınır?",
      icon: <HelpCircle className="h-5 w-5" />,
      action: () => navigate('/legal-aid'),
      color: "bg-green-100 text-green-600 hover:bg-green-200"
    },
    {
      title: "Acil Yardım",
      description: "ALO 175 - 7/24 hukuki bilgi",
      icon: <Phone className="h-5 w-5" />,
      action: () => window.open('tel:175'),
      color: "bg-red-100 text-red-600 hover:bg-red-200"
    }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      navigate(`/processes?search=${encodeURIComponent(query.trim())}`);
    }
  };

  // Show loading state to prevent flash
  if (loading || !homeContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Sayfa yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header onSearch={handleSearch} />

      {/* Hero Section - Mobile Optimized */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {homeContent.hero_title}
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {homeContent.hero_title_highlight}
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {homeContent.hero_subtitle}
          </p>
          
          {/* CTA Buttons - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              size="lg"
              onClick={() => navigate(homeContent.hero_primary_btn_url)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {homeContent.hero_primary_btn_text}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate(homeContent.hero_secondary_btn_url)}
              className="px-8 py-4 text-lg border-2 border-green-300 text-green-600 hover:border-green-600 hover:bg-green-50 transition-all duration-300"
            >
              {homeContent.hero_secondary_btn_text}
            </Button>
          </div>

          {/* Quick Actions - Mobile */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-8">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={action.action}
                className={`${action.color} transition-all duration-300`}
              >
                {action.icon}
                <div className="ml-2 text-left">
                  <div className="text-xs font-medium">{action.title}</div>
                  <div className="text-xs opacity-80">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {processStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <AdBanner type="horizontal" />
        </div>
      </div>

      {/* Features Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {homeContent.features_title}
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {homeContent.features_description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 group border-2 hover:border-blue-200">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-white w-fit shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <AdBanner type="square" />
        </div>
      </div>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            {homeContent.bottom_cta_title}
          </h3>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
            {homeContent.bottom_cta_description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate(homeContent.bottom_cta_primary_btn_url)}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {homeContent.bottom_cta_primary_btn_text}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate(homeContent.bottom_cta_secondary_btn_url)}
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              {homeContent.bottom_cta_secondary_btn_text}
              <HelpCircle className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Global footer is rendered via App.js */}
    </div>
  );
};

export default HomePageNew;