import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { BookOpen, Calendar, User, Clock, ArrowRight, Scale } from 'lucide-react';
import { useBlogPosts } from '../hooks/useApi';
import Header from './Header';
import AdBanner from './AdBanner';

const BlogPage = () => {
  const { data: apiBlogPosts, loading, error } = useBlogPosts({ limit: 20 });
  
  const blogPosts = apiBlogPosts || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Blog yazıları yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error durumunda boş durum göster
  if (error && !apiBlogPosts) {
    console.log('API error:', error);
  }

  // Use blogPosts directly (already has fallback)
  const posts = blogPosts;

  const categories = [
    "Tümü",
    "Aile Hukuku",
    "İş Hukuku", 
    "Miras Hukuku",
    "Ceza Hukuku",
    "İcra Hukuku",
    "Genel"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Hukuk Blog
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Hukuki gelişmeler, yeni düzenlemeler ve pratik bilgiler hakkında 
            uzman görüşleri ve güncel içerikler.
          </p>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <AdBanner type="horizontal" />
        </div>
      </div>

      {/* Categories */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 px-4 py-2"
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.length === 0 && (
              <div className="col-span-full text-center text-gray-600">Blog yazısı bulunamadı.</div>
            )}
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={post.color || "bg-blue-100 text-blue-700"} variant="outline">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime || "5 dk"}
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{post.published_at ? new Date(post.published_at).toLocaleDateString('tr-TR') : post.date}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
                    <span>Devamını Oku</span>
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
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

      {/* Newsletter Subscription */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Hukuki Gelişmeleri Kaçırmayın
          </h2>
          <p className="text-gray-600 mb-6">
            Yeni blog yazıları ve hukuki gelişmeler hakkında e-posta ile bilgilendirilmek ister misiniz?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Abone Ol
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;