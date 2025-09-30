import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Heart, Home, Briefcase, Scale, Clock, TrendingUp, Users, DollarSign, HelpCircle } from 'lucide-react';
import { legalProcesses } from '../data/mock';
import AdBanner from './AdBanner';

const ProcessList = () => {
  const navigate = useNavigate();

  const iconMap = {
    Heart: Heart,
    Home: Home,
    Briefcase: Briefcase,
    Scale: Scale
  };

  const difficultyColors = {
    'Kolay': 'bg-green-100 text-green-700',
    'Orta': 'bg-yellow-100 text-yellow-700',
    'Zor': 'bg-red-100 text-red-700'
  };

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
              <h1 className="text-xl font-semibold text-gray-900">Hukuki Süreçler</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/adli-yardim-hizmetleri')}
              className="text-green-600 border-green-300 hover:bg-green-50"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              Adli Yardım
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile-First Main Content */}
      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Description */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Karmaşık hukuki süreçleri adım adım
              <br className="hidden sm:block" />
              <span className="text-blue-600">görselleştirerek öğrenin</span>
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Öğrenmek istediğiniz hukuki süreci seçin ve interaktif görsellerle 
              adım adım öğrenin.
            </p>
          </div>

          {/* Ad Banner */}
          <AdBanner type="horizontal" className="mb-8" />

          {/* Process Cards - Mobile Optimized */}
          <div className="space-y-4 mb-8">
            {legalProcesses.map((process) => {
              const IconComponent = iconMap[process.icon];
              return (
                <Card 
                  key={process.id} 
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-blue-200 overflow-hidden"
                  onClick={() => navigate(`/hukuki-surec/${process.id}`)}
                >
                  <div className={`h-2 bg-gradient-to-r ${process.gradient}`}></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-xl ${process.color.replace('bg-', 'bg-').replace('-500', '-100')} text-white transition-transform group-hover:scale-110`}>
                        <div className={`p-2 rounded-lg ${process.color}`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">
                          {process.totalSteps} Adım
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
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Süre: {process.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>Zorluk: {process.difficulty}</span>
                      </div>
                    </div>
                    
                    {/* Cost Range */}
                    {process.estimatedCosts && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-orange-600">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span className="font-medium">Tahmini Maliyet</span>
                          </div>
                          <Badge variant="outline" className="text-orange-700">
                            {process.estimatedCosts.totalRange}
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{process.totalSteps} adım içerir</span>
                      </div>
                      <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
                        <span>Keşfet</span>
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

          {/* Ad Banner */}
          <AdBanner type="square" className="mb-8" />

          {/* How It Works Section - Mobile Optimized */}
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Nasıl Çalışır?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Süreç Seçin</h4>
                <p className="text-gray-600 text-sm text-center">Öğrenmek istediğiniz hukuki süreci yukarıdan seçin</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Adımları İnceleyin</h4>
                <p className="text-gray-600 text-sm text-center">İnteraktif süreç haritasında her adımı tıklayın</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Detayları Öğrenin</h4>
                <p className="text-gray-600 text-sm text-center">Süre, katılımcılar, masraflar ve gerekli belgeleri görün</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProcessList;