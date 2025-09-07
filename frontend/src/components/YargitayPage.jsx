import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Gavel, Calendar, FileText, Search, Download, ExternalLink } from 'lucide-react';
import Header from './Header';
import AdBanner from './AdBanner';
import apiService from '../services/api';

const YargitayPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        setLoading(true);
        const data = await apiService.getSupremeCourtDecisions({ limit: 50 });
        // Ensure array and basic shape
        const normalized = (data || []).map((d) => ({
          id: d.id,
          title: d.title,
          summary: d.summary,
          court: d.court || '',
          date: d.date || '',
          category: d.category || 'Diğer',
          keywords: Array.isArray(d.keywords) ? d.keywords : [],
          importance_level: d.importance_level || 'medium',
        }));
        setDecisions(normalized);
        setError(null);
      } catch (e) {
        setError('Kararlar yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    fetchDecisions();
  }, []);

  const categories = React.useMemo(() => {
    const counts = decisions.reduce((acc, d) => {
      acc[d.category] = (acc[d.category] || 0) + 1;
      return acc;
    }, {});
    const list = Object.keys(counts).sort().map((k) => ({ id: k, label: k, count: counts[k] }));
    return [{ id: 'all', label: 'Tümü', count: decisions.length }, ...list];
  }, [decisions]);

  const filteredDecisions = decisions.filter((d) => {
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q ||
      (d.title || '').toLowerCase().includes(q) ||
      (d.summary || '').toLowerCase().includes(q) ||
      (d.court || '').toLowerCase().includes(q) ||
      (d.keywords || []).some((k) => (k || '').toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            {loading && (
              <div className="col-span-full text-center text-gray-600">Yükleniyor...</div>
            )}
            {!loading && filteredDecisions.length === 0 && (
              <div className="col-span-full text-center text-gray-600">Kayıt bulunamadı.</div>
            )}
            {!loading && filteredDecisions.map((decision) => (
              <Card key={decision.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline">
                      {decision.category}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {decision.date ? new Date(decision.date).toLocaleDateString('tr-TR') : '-'}
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
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(decision.keywords || []).map((keyword, index) => (
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