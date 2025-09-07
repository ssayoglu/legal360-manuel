import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Gavel, Calendar, FileText, Search, Download, ExternalLink } from 'lucide-react';
import Header from './Header';
import AdBanner from './AdBanner';

const YargitayPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const decisions = [
    {
      id: 1,
      title: "Boşanma Davasında Mal Paylaşımı - Yargıtay 2. HD. E.2024/1234 K.2024/5678",
      summary: "Eşler arasında mal rejimi sözleşmesi bulunmadığı durumda, evlilik süresince edinilen malların paylaşımı konusunda Yargıtay'ın görüşü...",
      court: "2. Hukuk Dairesi",
      date: "2024-12-15",
      category: "Aile Hukuku",
      keywords: ["boşanma", "mal paylaşımı", "yasal mal rejimi"],
      color: "bg-blue-100 text-blue-700"
    },
    {
      id: 2,
      title: "İş Kazası Sonucu Tazminat - Yargıtay 21. HD. E.2024/2345 K.2024/6789",
      summary: "İşçinin iş kazası sonucu ölümü durumunda, işverenin sorumluluğu ve ödenecek tazminat miktarının belirlenmesi...",
      court: "21. Hukuk Dairesi",
      date: "2024-12-10",
      category: "İş Hukuku",
      keywords: ["iş kazası", "tazminat", "işveren sorumluluğu"],
      color: "bg-orange-100 text-orange-700"
    },
    {
      id: 3,
      title: "Miras Hukukunda Saklı Pay - Yargıtay 1. HD. E.2024/3456 K.2024/7890",
      summary: "Mirasçıların saklı payları ve bunları aşan tasarruflara karşı açılacak tenkis davası şartları...",
      court: "1. Hukuk Dairesi",
      date: "2024-12-05",
      category: "Miras Hukuku",
      keywords: ["miras", "saklı pay", "tenkis davası"],
      color: "bg-green-100 text-green-700"
    },
    {
      id: 4,
      title: "Kasten Yaralama Suçu - Yargıtay 3. CD. E.2024/4567 K.2024/8901",
      summary: "Kasten yaralama suçunda mağdurun kusurlu davranışının sanığa verilecek ceza üzerindeki etkisi...",
      court: "3. Ceza Dairesi",
      date: "2024-11-28",
      category: "Ceza Hukuku",
      keywords: ["kasten yaralama", "mağdurun kusuru", "ceza indirimi"],
      color: "bg-red-100 text-red-700"
    },
    {
      id: 5,
      title: "İcra Takibinde İtiraz - Yargıtay 12. HD. E.2024/5678 K.2024/9012",
      summary: "İcra takibinde borçlunun itirazı ve alacaklının bu itiraza karşı açacağı itirazın iptali davası...",
      court: "12. Hukuk Dairesi",
      date: "2024-11-20",
      category: "İcra Hukuku",
      keywords: ["icra takibi", "itiraz", "itirazın iptali"],
      color: "bg-purple-100 text-purple-700"
    },
    {
      id: 6,
      title: "Kira Sözleşmesi Feshi - Yargıtay 6. HD. E.2024/6789 K.2024/0123",
      summary: "Kiracının kira bedelini ödememesi durumunda kiralayanın sözleşmeyi fesih hakkı ve tahliye davası...",
      court: "6. Hukuk Dairesi",
      date: "2024-11-15",
      category: "Borçlar Hukuku",
      keywords: ["kira sözleşmesi", "fesih", "tahliye"],
      color: "bg-indigo-100 text-indigo-700"
    }
  ];

  const categories = [
    { id: 'all', label: 'Tümü', count: decisions.length },
    { id: 'Aile Hukuku', label: 'Aile Hukuku', count: 1 },
    { id: 'İş Hukuku', label: 'İş Hukuku', count: 1 },
    { id: 'Miras Hukuku', label: 'Miras Hukuku', count: 1 },
    { id: 'Ceza Hukuku', label: 'Ceza Hukuku', count: 1 },
    { id: 'İcra Hukuku', label: 'İcra Hukuku', count: 1 },
    { id: 'Borçlar Hukuku', label: 'Borçlar Hukuku', count: 1 }
  ];

  const filteredDecisions = selectedCategory === 'all' 
    ? decisions 
    : decisions.filter(d => d.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg">
              <Gavel className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Yargıtay Kararları
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Yargıtay'ın güncel kararları ve içtihadları. Hukuki konularda 
            rehber niteliğindeki önemli kararlar ve açıklamaları.
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Karar ara... (örn: boşanma, tazminat, miras)"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <AdBanner type="horizontal" />
        </div>
      </div>

      {/* Categories Filter */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-red-600 hover:bg-red-700" : "hover:border-red-300"}
              >
                {category.label}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Decisions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDecisions.map((decision) => (
              <Card key={decision.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={decision.color} variant="outline">
                      {decision.category}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(decision.date).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <CardTitle className="text-base group-hover:text-red-600 transition-colors leading-snug">
                    {decision.title}
                  </CardTitle>
                  <div className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">{decision.court}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4 text-sm">
                    {decision.summary}
                  </CardDescription>
                  
                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {decision.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        Detay
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                    </div>
                    <div className="flex items-center text-red-600 font-medium text-sm group-hover:text-red-700">
                      <span>İncele</span>
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <AdBanner type="square" />
        </div>
      </div>

      {/* Info Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Yargıtay Kararları Hakkında
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Kararların Önemi</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Yargıtay kararları, hukuki uyuşmazlıkların çözümünde rehber niteliği taşır. 
                  İçtihat niteliğindeki bu kararlar, benzer davalarda nasıl karar verileceğini 
                  gösterir.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Nasıl Kullanılır?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Bu kararları kendi hukuki sorununuzla benzerlik gösteren durumları 
                  bulmak için kullanabilirsiniz. Ancak mutlaka bir hukuk uzmanına danışın.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default YargitayPage;