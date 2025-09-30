import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ArrowLeft, Scale, Users, FileText, MessageCircle, Phone, MapPin, Globe, Clock, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useLegalAidInfo } from '../hooks/useApi';
import AdBanner from './AdBanner';
import { usePageTitle } from '../hooks/usePageTitle';



const LegalAidPage = () => {
  const navigate = useNavigate();
  const { data: apiLegalAidInfo, loading, error } = useLegalAidInfo(); console.log("LegalAid Debug:", { apiLegalAidInfo, loading, error });
  usePageTitle('Adli Yardım – Legal Design Turkey', 'Ücretsiz adli yardım hizmetleri hakkında bilgiler ve baro iletişimleri.');
  
  // State for baro optimization
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllBaros, setShowAllBaros] = useState(false);
  const [visibleBaroCount, setVisibleBaroCount] = useState(6); // Show first 6 by default
  
  // Convert backend field names to frontend field names
  const processedApiData = apiLegalAidInfo ? {
    ...apiLegalAidInfo,
    sections: apiLegalAidInfo.sections || [],
    helplines: apiLegalAidInfo.helplines || [],
    baroContacts: apiLegalAidInfo.baro_contacts || [],
    required_documents: apiLegalAidInfo.required_documents || [],
    important_notes: apiLegalAidInfo.important_notes || []
  } : null;
  
  // Use API data only
  const legalAidInfo = processedApiData;

  const iconMap = {
    Scale: Scale,
    Users: Users,
    FileText: FileText,
    MessageCircle: MessageCircle
  };

  const iconColorMap = {
    Scale: 'text-blue-600',
    Users: 'text-green-600',
    FileText: 'text-purple-600',
    MessageCircle: 'text-orange-600',
  };

  // Filter and paginate baro contacts
  const filteredBaros = useMemo(() => {
    if (!legalAidInfo?.baroContacts) return [];
    
    return legalAidInfo.baroContacts.filter(baro => 
      baro?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      baro?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [legalAidInfo?.baroContacts, searchTerm]);

  const displayedBaros = useMemo(() => {
    if (showAllBaros) return filteredBaros;
    return filteredBaros.slice(0, visibleBaroCount);
  }, [filteredBaros, showAllBaros, visibleBaroCount]);

  const hasMoreBaros = filteredBaros.length > visibleBaroCount;
  const totalBaros = filteredBaros.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Adli yardım bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error durumunda da mock data'yı göster
  if (error && !apiLegalAidInfo) {
    console.log('API error, using mock data:', error);
  }

  if (!legalAidInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <Scale className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-600">Adli yardım bilgileri bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ana Sayfa
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Adli Yardım</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg">
                <Scale className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {legalAidInfo.title}
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto mb-6">
              {legalAidInfo.description}
            </p>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              Tamamen Ücretsiz Hizmet
            </Badge>
          </div>

          {/* Ad Banner */}
          <AdBanner type="horizontal" className="mb-8" />

          {/* Info Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {legalAidInfo?.sections?.map((section, index) => {
              const IconComponent = iconMap[section.icon];
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg ${section?.color || 'bg-gray-100'}`}>
                        <IconComponent className={`h-5 w-5 ${iconColorMap[section?.icon] || 'text-gray-700'}`} />
                      </div>
                      <CardTitle className="text-lg">{section?.title || ''}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700 leading-relaxed">
                      {section?.content || ''}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Emergency Helplines */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Phone className="h-6 w-6 mr-2 text-green-600" />
                Acil Yardım Hatları
              </CardTitle>
              <CardDescription>
                7/24 ulaşabileceğiniz ücretsiz yardım hatları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {legalAidInfo?.helplines?.map((helpline, index) => (
                  <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-2xl font-bold text-green-600">{helpline?.phone || ''}</div>
                      <div className="flex items-center text-xs text-green-700">
                        <Clock className="h-3 w-3 mr-1" />
                        {helpline?.hours || ''}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 mb-1">{helpline?.name || ''}</div>
                    <div className="text-xs text-gray-600">{helpline?.description || ''}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ad Banner */}
          <AdBanner type="square" className="mb-8" />

          {/* Baro Contacts - Optimized */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-xl flex items-center">
                <MapPin className="h-6 w-6 mr-3 text-blue-600" />
                <span className="text-gray-800">Baro İletişim Bilgileri</span>
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Türkiye'nin 81 ilindeki baro iletişim bilgileri ({totalBaros} baro)
              </CardDescription>
              
              {/* Search Box */}
              <div className="mt-4 relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Şehir veya baro adı ile ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {displayedBaros.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayedBaros.map((baro, index) => (
                      <div key={index} className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {baro?.city || ''}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {baro?.name || ''}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start">
                            <Phone className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 font-medium">{baro?.phone || ''}</span>
                          </div>
                          
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{baro?.address || ''}</span>
                          </div>
                          
                          {baro?.website && (
                            <div className="flex items-start">
                              <Globe className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                              <a 
                                href={`https://${baro.website}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline text-xs"
                              >
                                {baro.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Load More Button */}
                  {hasMoreBaros && !showAllBaros && (
                    <div className="mt-6 text-center">
                      <Button
                        onClick={() => setShowAllBaros(true)}
                        variant="outline"
                        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
                      >
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Tüm Baroları Göster ({totalBaros - visibleBaroCount} baro daha)
                      </Button>
                    </div>
                  )}
                  
                  {/* Show Less Button */}
                  {showAllBaros && (
                    <div className="mt-6 text-center">
                      <Button
                        onClick={() => setShowAllBaros(false)}
                        variant="outline"
                        className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      >
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Daha Az Göster
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Arama sonucu bulunamadı</p>
                  <p className="text-sm">Farklı bir arama terimi deneyin</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Required Documents */}
          <Card className="mt-8">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center text-xl">
                <FileText className="h-6 w-6 mr-3 text-blue-600" />
                <span className="text-gray-800">Gerekli Belgeler</span>
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Başvuru sırasında sunulması gereken belgeler
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {legalAidInfo?.required_documents?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {legalAidInfo.required_documents.map((doc, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-medium">{doc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Gerekli belgeler listesi yükleniyor...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Important Notes */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start">
              <Scale className="h-6 w-6 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-amber-800 mb-2">Önemli Bilgiler</h3>
                {(legalAidInfo?.important_notes?.length || 0) > 0 ? (
                  <ul className="space-y-2 text-sm text-amber-800">
                    {legalAidInfo.important_notes.map((n, i) => (
                      <li key={i}>• {n}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-amber-700">Önemli bilgiler bulunamadı.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LegalAidPage;