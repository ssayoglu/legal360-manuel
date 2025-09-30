import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowRight, Scale, Users, BookOpen, Shield, Smartphone, Clock, TrendingUp, HelpCircle, Phone } from 'lucide-react';
import AdBanner from './AdBanner';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobil Uyumlu",
      description: "Her cihazda kolayca kullanabileceğiniz responsive tasarım"
    },
    {
      icon: <Scale className="h-8 w-8" />,
      title: "Görsel İçerik",
      description: "Karmaşık hukuki süreçleri anlaşılır görsellerle öğrenin"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Vatandaş Odaklı",
      description: "Hukukçu olmayan vatandaşlar için tasarlandı"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Adım Adım Rehber",
      description: "Her sürecin detaylı açıklaması ve yol haritası"
    }
  ];

  const processStats = [
    { 
      number: "4", 
      label: "Ana Süreç",
      description: "Boşanma, Miras, İş Davası, Ceza"
    },
    { 
      number: "25+", 
      label: "Detaylı Adım",
      description: "Her süreç için kapsamlı açıklamalar"
    },
    { 
      number: "100%", 
      label: "Ücretsiz",
      description: "Tüm içerikler tamamen ücretsiz"
    }
  ];

  const quickActions = [
    {
      title: "Adli Yardım",
      description: "Ücretsiz hukuki yardım nasıl alınır?",
      icon: <HelpCircle className="h-5 w-5" />,
      action: () => navigate('/adli-yardim-hizmetleri'),
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Scale className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Legal Design Turkey</h1>
                <p className="text-sm text-gray-600">Hukuki süreçleri görselleştirerek vatandaşların anlamasını kolaylaştırıyoruz</p>
              </div>
            </div>
            <div className="hidden sm:flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/adli-yardim-hizmetleri')}
                className="text-green-600 border-green-300 hover:bg-green-50"
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                Adli Yardım
              </Button>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Beta Sürüm
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Mobile Optimized */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Hukuki Süreçleri
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Görselleştiriyoruz
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Karmaşık hukuki süreçleri anlaşılır görsellerle öğrenin. Vatandaşların hukuki haklarını 
            öğrenmesi için tasarlanmış interaktif platform.
          </p>
          
          {/* CTA Buttons - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              size="lg"
              onClick={() => navigate('/hukuki-surecler')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Süreçleri Keşfedin
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/adli-yardim-hizmetleri')}
              className="px-8 py-4 text-lg border-2 border-green-300 text-green-600 hover:border-green-600 hover:bg-green-50 transition-all duration-300"
            >
              Ücretsiz Yardım Al
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
              Neden Legal Design Turkey?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hukuki süreçleri herkesin anlayabileceği şekilde görselleştiriyoruz
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
            Hukuki Süreçlerinizi Bugün Öğrenin
          </h3>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
            Boşanma, miras, iş davası ve ceza yargılaması süreçlerini 
            interaktif görsellerle keşfedin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/hukuki-surecler')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Hemen Başlayın
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/adli-yardim-hizmetleri')}
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              Ücretsiz Yardım
              <HelpCircle className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Legal Design Turkey</span>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed max-w-2xl mx-auto">
              Hukuki süreçleri görselleştirerek vatandaşların anlayabileceği hale getiriyoruz.
              Herkes için erişilebilir, anlaşılır ve ücretsiz hukuki rehberlik.
            </p>
            
            {/* Footer Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
              <button 
                onClick={() => navigate('/legal-aid')}
                className="hover:text-white transition-colors"
              >
                Adli Yardım
              </button>
              <span>•</span>
              <a href="tel:175" className="hover:text-white transition-colors">
                ALO 175
              </a>
              <span>•</span>
              <span>Ücretsiz Hukuki Bilgi</span>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-sm text-gray-500">
              © 2025 Legal Design Turkey. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
        
        {/* Mobile Ad Banner in Footer */}
        <div className="mt-6 sm:hidden">
          <AdBanner type="mobile" />
        </div>
      </footer>
    </div>
  );
};

export default HomePage;