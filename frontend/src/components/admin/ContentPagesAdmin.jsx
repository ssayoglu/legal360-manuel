import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye,
  Search,
  FileText,
  Globe,
  Settings
} from 'lucide-react';
import { API_CONFIG } from '../../config';

const ContentPagesAdmin = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    meta_title: '',
    meta_description: '',
    content: '',
    sections: [],
    is_published: true
  });

  const defaultPages = [
    {
      slug: 'home',
      title: 'Ana Sayfa',
      description: 'Site ana sayfa içeriği'
    },
    {
      slug: 'about',
      title: 'Hakkımızda',
      description: 'Şirket ve hizmetler hakkında bilgi'
    },
    {
      slug: 'contact',
      title: 'İletişim',
      description: 'İletişim bilgileri ve form'
    },
    {
      slug: 'privacy',
      title: 'Gizlilik Politikası',
      description: 'Veri koruma ve gizlilik politikası'
    },
    {
      slug: 'terms',
      title: 'Kullanım Koşulları',
      description: 'Site kullanım şartları'
    }
  ];

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/content-pages`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      meta_title: '',
      meta_description: '',
      content: '',
      sections: [],
      is_published: true
    });
  };

  const handleSave = async (data, isNew = false) => {
    try {
      const token = localStorage.getItem('admin_token');
      const url = isNew 
        ? `${API_CONFIG.BACKEND_URL}/api/admin/content-pages`
        : `${API_CONFIG.BACKEND_URL}/api/admin/content-pages/${data.slug}`;

      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchPages();
        if (isNew) {
          setShowAddForm(false);
          resetForm();
        } else {
          setEditingId(null);
        }
      } else {
        const error = await response.text();
        alert('Kaydetme işlemi başarısız: ' + error);
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Kaydetme hatası: ' + error.message);
    }
  };

  const handleDelete = async (slug) => {
    if (!confirm('Bu sayfayı silmek istediğinizden emin misiniz?')) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/content-pages/${slug}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        await fetchPages();
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const createDefaultPage = async (pageTemplate) => {
    const defaultContent = getDefaultContent(pageTemplate.slug);
    const newPageData = {
      ...pageTemplate,
      content: defaultContent.content,
      sections: defaultContent.sections,
      meta_title: pageTemplate.title + ' - Legal Design Turkey',
      meta_description: pageTemplate.description,
      is_published: true
    };
    
    await handleSave(newPageData, true);
  };

  const getDefaultContent = (slug) => {
    switch (slug) {
      case 'home':
        return {
          content: `<div class="hero-section">
            <h1>Hukuki Süreçleri Görselleştiriyoruz</h1>
            <p>Hukuki süreçleri anlaşılır şekilde adım adım takip edin. Masrafları hesaplayın, gerekli belgeleri öğrenin.</p>
            <div class="cta-buttons">
              <a href="/hukuki-surecler" class="btn btn-primary">Süreçleri Keşfedin</a>
              <a href="/adli-yardim" class="btn btn-secondary">Ücretsiz Yardım Al</a>
            </div>
          </div>`,
          sections: [
            {
              type: 'hero',
              title: 'Hukuki Süreçleri Görselleştiriyoruz',
              subtitle: 'Hukuki süreçleri anlaşılır şekilde adım adım takip edin',
              buttons: [
                { text: 'Süreçleri Keşfedin', url: '/hukuki-surecler', type: 'primary' },
                { text: 'Ücretsiz Yardım Al', url: '/adli-yardim', type: 'secondary' }
              ]
            }
          ]
        };
      case 'about':
        return {
          content: `<h1>Hakkımızda</h1>
            <p>Legal Design Turkey olarak hukuki süreçleri daha anlaşılır ve erişilebilir hale getirmeyi amaçlıyoruz.</p>
            <h2>Misyonumuz</h2>
            <p>Hukuki bilgiyi herkes için erişilebilir kılmak ve adalet sistemini daha şeffaf hale getirmek.</p>`,
          sections: []
        };
      case 'contact':
        return {
          content: `<h1>İletişim</h1>
            <p>Sorularınız için bizimle iletişime geçin.</p>
            <div class="contact-info">
              <p><strong>E-posta:</strong> info@legaldesignturkey.com</p>
              <p><strong>Telefon:</strong> +90 XXX XXX XX XX</p>
            </div>`,
          sections: []
        };
      default:
        return {
          content: `<h1>${slug.charAt(0).toUpperCase() + slug.slice(1)}</h1><p>Bu sayfa içeriği henüz eklenmemiş.</p>`,
          sections: []
        };
    }
  };

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Sayfalar yükleniyor...</p>
        </div>
      </div>
    );
  }

  const PageForm = ({ data, onChange, onSave, onCancel, isNew = false }) => (
    <Card className="border-blue-300 mb-6">
      <CardHeader>
        <CardTitle className="text-lg text-blue-600">
          {isNew ? 'Yeni Sayfa' : 'Sayfa Düzenleme'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sayfa Başlığı *
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="örn: Hakkımızda"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              value={data.slug}
              onChange={(e) => onChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              placeholder="örn: hakkimizda"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
              disabled={!isNew}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meta Title (SEO)
          </label>
          <input
            type="text"
            value={data.meta_title || ''}
            onChange={(e) => onChange('meta_title', e.target.value)}
            placeholder="SEO için sayfa başlığı"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meta Description (SEO)
          </label>
          <textarea
            value={data.meta_description || ''}
            onChange={(e) => onChange('meta_description', e.target.value)}
            placeholder="SEO için sayfa açıklaması"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sayfa İçeriği (HTML) *
          </label>
          <textarea
            value={data.content}
            onChange={(e) => onChange('content', e.target.value)}
            placeholder="HTML içerik..."
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            required
          />
          <p className="text-xs text-gray-500 mt-1">HTML kodları kullanabilirsiniz</p>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_published"
            checked={data.is_published}
            onChange={(e) => onChange('is_published', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
            Yayınlansın
          </label>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            İptal
          </Button>
          <Button onClick={() => onSave(data, isNew)} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            {isNew ? 'Kaydet' : 'Güncelle'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İçerik Sayfaları</h1>
          <p className="text-gray-600">Ana sayfa, hakkımızda, iletişim gibi sayfaları yönetin</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Sayfa
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Sayfa ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Default Pages to Create */}
      {pages.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Varsayılan Sayfalar</CardTitle>
            <CardDescription>Bu sayfaları oluşturmak için tıklayın</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {defaultPages.map((page) => (
                <Card key={page.slug} className="border-dashed">
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{page.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{page.description}</p>
                    <Button 
                      size="sm" 
                      onClick={() => createDefaultPage(page)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Oluştur
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Form */}
      {showAddForm && (
        <PageForm
          data={formData}
          onChange={(field, value) => setFormData({...formData, [field]: value})}
          onSave={handleSave}
          onCancel={() => {
            setShowAddForm(false);
            resetForm();
          }}
          isNew={true}
        />
      )}

      {/* Pages List */}
      <div className="space-y-4">
        {filteredPages.length === 0 && pages.length > 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Arama kriterine uygun sayfa bulunamadı.</p>
            </CardContent>
          </Card>
        ) : (
          filteredPages.map((page) => (
            <Card key={page.id} className="hover:shadow-md transition-shadow">
              {editingId === page.id ? (
                <PageForm
                  data={page}
                  onChange={(field, value) => {
                    const updatedPage = {...page, [field]: value};
                    setPages(pages.map(p => p.id === page.id ? updatedPage : p));
                  }}
                  onSave={handleSave}
                  onCancel={() => setEditingId(null)}
                  isNew={false}
                />
              ) : (
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{page.title}</h3>
                        <Badge variant={page.is_published ? 'default' : 'secondary'}>
                          {page.is_published ? 'Yayında' : 'Taslak'}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 space-x-4 mb-2">
                        <span className="flex items-center">
                          <Globe className="h-4 w-4 mr-1" />
                          /{page.slug}
                        </span>
                        <span>Son güncelleme: {new Date(page.updated_at).toLocaleDateString('tr-TR')}</span>
                      </div>
                      {page.meta_description && (
                        <p className="text-gray-600 text-sm">{page.meta_description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/${page.slug}`, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(page.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(page.slug)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentPagesAdmin;