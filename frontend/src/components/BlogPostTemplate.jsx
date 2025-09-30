import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import AdBanner from './AdBanner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, User } from 'lucide-react';
import { apiService } from '../services/api';
import { usePageTitle } from '../hooks/usePageTitle';

const BlogPostTemplate = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const computedTitle = post ? `${post.meta_title || post.title} – Legal Design Turkey` : 'Blog Yazısı – Legal Design Turkey';
  usePageTitle(computedTitle, post?.meta_description || post?.excerpt);


  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await apiService.getBlogPost(slug);
        setPost(data);
      } catch (e) {
        setError('Yazı yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
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

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-600">{error || 'Yazı bulunamadı'}</p>
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
          <Badge variant="outline" className="mb-3">{post.category}</Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
          <p className="text-gray-600 mb-4">{post.excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center"><User className="h-4 w-4 mr-1" /> {post.author}</span>
            <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {post.published_at ? new Date(post.published_at).toLocaleDateString('tr-TR') : ''}</span>
          </div>
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
              <CardTitle>Yazı</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-lg prose-blue max-w-none prose-headings:text-gray-900 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:text-gray-700 prose-strong:text-gray-900 prose-a:text-blue-600" 
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default BlogPostTemplate;


