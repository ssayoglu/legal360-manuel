import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import AdBanner from './AdBanner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Gavel, Hash } from 'lucide-react';
import apiService from '../services/api';
import { usePageTitle } from '../hooks/usePageTitle';

const SupremeCourtDecisionTemplate = () => {
  const { id } = useParams();
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const computedTitle = decision ? `${decision.title} – Yargıtay Kararı – Legal Design Turkey` : 'Yargıtay Kararı – Legal Design Turkey';
  usePageTitle(computedTitle, decision?.summary || decision?.full_text?.slice(0, 160));

  useEffect(() => {
    const fetchDecision = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await apiService.getSupremeCourtDecision(id);
        setDecision(data);
      } catch (e) {
        setError('Karar yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    fetchDecision();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
        </div>
      </div>
    );
  }

  if (error || !decision) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-600">{error || 'Karar bulunamadı'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />

      {/* Hero */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Gavel className="h-6 w-6 text-red-600" />
            <Badge variant="outline">{decision.category}</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{decision.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {decision.date ? new Date(decision.date).toLocaleDateString('tr-TR') : ''}</span>
            <span className="flex items-center"><Hash className="h-4 w-4 mr-1" /> {decision.decision_number}</span>
            <span className="font-medium">{decision.court}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {decision.keywords?.map((k, i) => (
              <Badge key={i} variant="secondary" className="text-xs">{k}</Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Ad */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <AdBanner type="horizontal" />
        </div>
      </div>

      {/* Full Text */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Karar Metni</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-red max-w-none" dangerouslySetInnerHTML={{ __html: decision.content }} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default SupremeCourtDecisionTemplate;


