import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import AdBanner from './AdBanner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileText } from 'lucide-react';
import { apiService } from '../services/api';
import { usePageTitle } from '../hooks/usePageTitle';

const ContentPageTemplate = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const computedTitle = page ? `${page.meta_title || page.title} – Legal Design Turkey` : 'Sayfa – Legal Design Turkey';
  usePageTitle(computedTitle, page?.meta_description);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await apiService.getContentPage(slug);
        setPage(data);
      } catch (e) {
        setError('Sayfa yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-600">{error || 'Sayfa bulunamadı'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />

      {/* Hero */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg">
              <FileText className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{page.title}</h1>
          {page.meta_description && (
            <p className="text-gray-600 max-w-2xl mx-auto">{page.meta_description}</p>
          )}
        </div>
      </section>

      {/* Ad */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <AdBanner type="horizontal" />
        </div>
      </div>

      {/* Content */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">İçerik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ContentPageTemplate;


