import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, Home, Briefcase, Scale, Clock, TrendingUp, Users, DollarSign, Filter, ChevronDown, MoreHorizontal } from 'lucide-react';
import { useLegalProcesses } from '../hooks/useApi';
import { legalProcesses as mockProcesses } from '../data/mock';
import AdBanner from './AdBanner';
import Header from './Header';

const ProcessListNew = () => {
  const navigate = useNavigate();
  const { data: apiProcesses, loading, error } = useLegalProcesses();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAllProcesses, setShowAllProcesses] = useState(false);

  // Mock data fallback
  const legalProcesses = apiProcesses || mockProcesses;

  // Debug logging
  console.log('ProcessListNew - Loading:', loading);
  console.log('ProcessListNew - Error:', error);
  console.log('ProcessListNew - Data:', legalProcesses);

  const iconMap = {
    Heart: Heart,
    Home: Home,
    Briefcase: Briefcase,
    Scale: Scale,
    DollarSign: DollarSign,
    Baby: Users, // Placeholder for Baby icon
    Car: Scale  // Placeholder for Car icon
  };

  const difficultyColors = {
    'Kolay': 'bg-green-100 text-green-700',
    'Orta': 'bg-yellow-100 text-yellow-700',
    'Zor': 'bg-red-100 text-red-700'
  };

  const categoryFilters = [
    { id: 'all', label: 'Tümü', count: legalProcesses?.length || 0 },
    { id: 'hukuk', label: 'Hukuk', count: legalProcesses?.filter(p => p.category === 'hukuk').length || 0 },
    { id: 'ceza', label: 'Ceza', count: legalProcesses?.filter(p => p.category === 'ceza').length || 0 }
  ];

  const filteredProcesses = useMemo(() => {
    if (!legalProcesses) return [];
    let filtered = legalProcesses;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(process => process.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(process => {
        const searchTerms = searchQuery.toLowerCase();
        return (
          process.title.toLowerCase().includes(searchTerms) ||
          process.description.toLowerCase().includes(searchTerms) ||
          (process.tags && process.tags.some(tag => tag.toLowerCase().includes(searchTerms)))
        );
      });
    }

    return filtered;
  }, [legalProcesses, searchQuery, selectedCategory]);

  const displayedProcesses = showAllProcesses ? filteredProcesses : filteredProcesses.slice(0, 6);
  const hasMoreProcesses = filteredProcesses.length > 6;

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header onSearch={handleSearch} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Hukuki süreçler yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error durumunda da mock data'yı göster
  if (error && !apiProcesses) {
    console.log('API error, using mock data:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header onSearch={handleSearch} />

      {/* Main Content */}
      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Hukuki Süreçler
              <span className="text-blue-600 block sm:inline sm:ml-2">Kütüphanesi</span>
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              {filteredProcesses.length} hukuki süreç arasından size uygun olanı seçin ve 
              adım adım öğrenin.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Kategori:</span>
              <div className="flex space-x-2">
                {categoryFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={selectedCategory === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(filter.id)}
                    className={selectedCategory === filter.id ? "bg-blue-600" : ""}
                  >
                    {filter.label}
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {filter.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Ad Banner */}
          <AdBanner type="horizontal" className="mb-6" />

          {/* Process Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {displayedProcesses.map((process) => {
              // Use emoji from API or fallback to Scale icon
              const processIcon = process.icon || '⚖️';
              const IconComponent = iconMap[process.icon] || Scale;
              
              return (
                <Card 
                  key={process.id} 
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-blue-200 overflow-hidden h-full"
                  onClick={() => navigate(`/process/${process.id}`)}
                >
                  <div className={`h-1 bg-gradient-to-r ${process.gradient || 'from-blue-400 to-blue-600'}`}></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-xl bg-white shadow-lg border-2 transition-transform group-hover:scale-110`} style={{ borderColor: process.color || '#3b82f6' }}>
                        {/* Render emoji directly from API */}
                        <div className="text-2xl">
                          {processIcon}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1 text-xs">
                          {process.total_steps || 0} Adım
                        </Badge>
                        <div className={`text-xs px-2 py-1 rounded-full ${difficultyColors[process.difficulty]}`}>
                          {process.difficulty}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold group-hover:text-blue-600 transition-colors mb-2">
                      {process.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm leading-relaxed">
                      {process.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{process.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>{process.difficulty}</span>
                      </div>
                    </div>
                    
                    {/* Cost Range */}
                    {process.estimated_costs && (
                      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded-lg mb-4 border border-orange-200">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center text-orange-600">
                            <DollarSign className="h-3 w-3 mr-1" />
                            <span className="font-medium">Tahmini Maliyet</span>
                          </div>
                          <Badge variant="outline" className="text-orange-700 border-orange-300 text-xs">
                            {process.estimated_costs.total_range}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(process.tags || []).slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-600">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{process.category === 'ceza' ? 'Ceza Hukuku' : 'Hukuk'}</span>
                      </div>
                      <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
                        <span>İncele</span>
                        <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Load More Button */}
          {hasMoreProcesses && !showAllProcesses && (
            <div className="text-center mb-8">
              <Button
                onClick={() => setShowAllProcesses(true)}
                variant="outline"
                size="lg"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Diğerleri ({filteredProcesses.length - 6} süreç daha)
              </Button>
            </div>
          )}

          {/* Ad Banner */}
          <AdBanner type="square" className="mb-8" />

          {/* No Results */}
          {filteredProcesses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Scale className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sonuç Bulunamadı
              </h3>
              <p className="text-gray-600 mb-4">
                Aradığınız kriterlere uygun hukuki süreç bulunamadı.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                variant="outline"
              >
                Filtreleri Temizle
              </Button>
            </div>
          )}

          {/* Help Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Aradığınızı Bulamadınız mı?
            </h3>
            <p className="text-gray-600 mb-6">
              Hukuki süreçler hakkında daha fazla bilgi almak istiyorsanız 
              uzmanlarımızdan yardım alabilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => navigate('/legal-aid')}
                className="bg-green-600 hover:bg-green-700"
              >
                Ücretsiz Yardım Al
              </Button>
              <Button
                onClick={() => navigate('/contact')}
                variant="outline"
              >
                İletişime Geç
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProcessListNew;