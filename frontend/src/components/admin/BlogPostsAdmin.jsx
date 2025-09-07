import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Calendar,
  User,
  FileText,
  AlertCircle
} from 'lucide-react';
import { API_CONFIG } from '../../config';

const BlogPostsAdmin = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/blog-posts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error('Failed to fetch blog posts');
        // Mock data fallback
        setPosts([
          {
            id: "mock-1",
            title: "Boşanma Sürecinde Bilinmesi Gerekenler",
            slug: "bosanma-surecinde-bilinmesi-gerekenler",
            excerpt: "Boşanma sürecinde dikkat edilmesi gereken önemli noktalar ve hukuki haklarınız.",
            content: "Boşanma süreci karmaşık ve duygusal olarak zorlu bir süreçtir...",
            author: "Av. Ayşe Demir",
            featured_image: null,
            tags: ["boşanma", "aile hukuku", "hukuki rehber"],
            category: "Aile Hukuku",
            is_published: true,
            created_at: "2024-01-15T10:00:00Z",
            updated_at: "2024-01-15T10:00:00Z"
          },
          {
            id: "mock-2",
            title: "İş Hukuku ve İşçi Haklarına Dair Bilinmesi Gerekenler",
            slug: "is-hukuku-ve-isci-haklari",
            excerpt: "İşyerinde karşılaştığınız sorunlar için hukuki çözüm yolları ve işçi haklarınız.",
            content: "İş hayatında karşılaşabileceğiniz durumlar ve bu durumlarda hukuki haklarınızı nasıl koruyabileceğiniz konusunda rehber niteliğinde bilgiler...",
            author: "Av. Mehmet Kaya",
            featured_image: null,
            tags: ["iş hukuku", "işçi hakları", "tazminat"],
            category: "İş Hukuku",
            is_published: true,
            created_at: "2024-01-10T14:30:00Z",
            updated_at: "2024-01-10T14:30:00Z"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Mock data fallback
      setPosts([
        {
          id: "mock-1",
          title: "Boşanma Sürecinde Bilinmesi Gerekenler",
          slug: "bosanma-surecinde-bilinmesi-gerekenler",
          excerpt: "Boşanma sürecinde dikkat edilmesi gereken önemli noktalar ve hukuki haklarınız.",
          content: "Boşanma süreci karmaşık ve duygusal olarak zorlu bir süreçtir...",
          author: "Av. Ayşe Demir",
          featured_image: null,
          tags: ["boşanma", "aile hukuku", "hukuki rehber"],
          category: "Aile Hukuku",
          is_published: true,
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T10:00:00Z"
        },
        {
          id: "mock-2",
          title: "İş Hukuku ve İşçi Haklarına Dair Bilinmesi Gerekenler",
          slug: "is-hukuku-ve-isci-haklari",
          excerpt: "İşyerinde karşılaştığınız sorunlar için hukuki çözüm yolları ve işçi haklarınız.",
          content: "İş hayatında karşılaşabileceğiniz durumlar ve bu durumlarda hukuki haklarınızı nasıl koruyabileceğiniz konusunda rehber niteliğinde bilgiler...",
          author: "Av. Mehmet Kaya",
          featured_image: null,
          tags: ["iş hukuku", "işçi hakları", "tazminat"],
          category: "İş Hukuku",
          is_published: true,
          created_at: "2024-01-10T14:30:00Z",
          updated_at: "2024-01-10T14:30:00Z"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/blog-posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPosts(posts.filter(p => p.id !== postId));
      } else {
        console.error('Failed to delete blog post');
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Blog yazıları yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Yazıları</h1>
          <p className="text-gray-600">Blog içeriklerini yönetin</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Yeni Yazı Ekle
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Blog yazısı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {post.is_published ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Yayında
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      Taslak
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {post.published_at 
                      ? new Date(post.published_at).toLocaleDateString('tr-TR')
                      : 'Yayınlanmamış'
                    }
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>{post.category}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags?.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {post.tags?.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  Görüntüle
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Düzenle
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Blog yazısı bulunamadı</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Arama kriterlerinize uygun blog yazısı bulunamadı.' 
                : 'Henüz hiç blog yazısı eklenmemiş.'}
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              İlk Blog Yazısını Ekle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlogPostsAdmin;