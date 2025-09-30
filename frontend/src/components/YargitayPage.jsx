import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Gavel, Calendar, FileText, Search, Download, ExternalLink } from 'lucide-react';
import Header from './Header';
import AdBanner from './AdBanner';
import apiService from '../services/api';
import { usePageTitle } from '../hooks/usePageTitle';
import SupremeCourtDecisionPreview from './SupremeCourtDecisionPreview';
import { useNavigate } from 'react-router-dom';

const YargitayPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  usePageTitle('Yargıtay Kararları – Legal Design Turkey', 'Güncel Yargıtay kararları ve özetleri.');

  useEffect(() => {
    const loadDecisions = async () => {
      try {
        setLoading(true);
        const data = await apiService.getSupremeCourtDecisions({});
        setDecisions(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load decisions', e);
        setError('Kararlar yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    loadDecisions();
  }, []);

  const CATEGORY_LABELS = {
    civil: 'Medeni Hukuk',
    criminal: 'Ceza Hukuku',
    family: 'Aile Hukuku',
    labor: 'İş Hukuku',
    commercial: 'Ticaret Hukuku',
  };

  const categories = [
    { id: 'all', label: 'Tümü', count: decisions.length },
    ...Array.from(new Set(decisions.map(d => d.category))).map(cat => ({
      id: cat,
      label: CATEGORY_LABELS[cat] || cat,
      count: decisions.filter(d => d.category === cat).length
    }))
  ];

  const filteredDecisions = (() => {
    const listByCategory = selectedCategory === 'all'
      ? decisions
      : decisions.filter(d => d.category === selectedCategory);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return listByCategory;
    return listByCategory.filter(d => {
      const title = (d.title || '').toLowerCase();
      const summary = (d.summary || '').toLowerCase();
      const court = (d.court || '').toLowerCase();
      const caseNo = String(d.case_number || d.caseNo || '').toLowerCase();
      const keywords = Array.isArray(d.keywords) ? d.keywords.map(k => String(k).toLowerCase()) : [];
      return (
        title.includes(q) ||
        summary.includes(q) ||
        court.includes(q) ||
        caseNo.includes(q) ||
        keywords.some(k => k.includes(q))
      );
    });
  })();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Yargıtay kararları yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

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
            {filteredDecisions.map((decision) => (
              <SupremeCourtDecisionPreview key={decision.id} decision={decision} onClick={() => navigate(`/yargitay/${decision.id}`)} />
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