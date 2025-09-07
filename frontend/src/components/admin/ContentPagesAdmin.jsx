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
  FileText,
  Globe,
  AlertCircle
} from 'lucide-react';
import { API_CONFIG } from '../../config';

const ContentPagesAdmin = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPage, setEditingPage] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    is_published: true
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/content-pages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPages(data);
      } else {
        console.error('Failed to fetch content pages');
        // Mock data fallback
        setPages([
          {
            id: "mock-1",
            title: "Hakkımızda",
            slug: "hakkimizda",
            content: "Legal Design Turkey hakkında bilgiler...",
            meta_description: "Legal Design Turkey hakkında detaylı bilgiler",
            is_published: true
          },
          {
            id: "mock-2",
            title: "İletişim",
            slug: "iletisim",
            content: "İletişim bilgileri ve form...",
            meta_description: "Bizimle iletişime geçin",
            is_published: true
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching content pages:', error);
      // Mock data fallback
      setPages([
        {
          id: "mock-1",
          title: "Hakkımızda",
          slug: "hakkimizda",
          content: "Legal Design Turkey hakkında bilgiler...",
          meta_description: "Legal Design Turkey hakkında detaylı bilgiler",
          is_published: true
        },
        {
          id: "mock-2",
          title: "İletişim",
          slug: "iletisim",
          content: "İletişim bilgileri ve form...",
          meta_description: "Bizimle iletişime geçin",
          is_published: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (pageData, isNew = false) => {
    try {
      const token = localStorage.getItem('admin_token');
      const url = isNew 
        ? `${API_CONFIG.BACKEND_URL}/api/admin/content-pages`
        : `${API_CONFIG.BACKEND_URL}/api/admin/content-pages/${pageData.id}`;
      
      const method = isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      });

      if (response.ok) {
        fetchPages();
        setEditingPage(null);
        setShowAddForm(false);
        setNewPage({
          title: '',
          slug: '',
          content: '',
          meta_description: '',
          is_published: true
        });
      } else {
        console.error('Failed to save page');
      }
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const handleDelete = async (pageId) => {
    if (!window.confirm('Bu sayfayı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/content-pages/${pageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPages(pages.filter(p => p.id !== pageId));
      } else {
        console.error('Failed to delete page');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const handleEdit = (page) => {
    setEditingPage({ ...page });
  };

  const handleCancelEdit = () => {
    setEditingPage(null);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">İçerik sayfaları yükleniyor...</p>
        </div>
      </div>
    );
  }

  const PageCard = ({ page, isEditing = false, onSave, onCancel, onEdit, onDelete }) => {
    const [editData, setEditData] = useState(page);

    const handleInputChange = (field, value) => {
      setEditData({ ...editData, [field]: value });
    };

    if (isEditing) {
      return (
        <Card className="border-blue-300">
          <CardHeader>
            <CardTitle className="text-sm text-blue-600">Sayfa Düzenleme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sayfa Başlığı
              </label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  handleInputChange('title', title);
                  handleInputChange('slug', generateSlug(title));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={editData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="sayfa-url-slug"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Açıklama
              </label>
              <textarea
                value={editData.meta_description}
                onChange={(e) => handleInputChange('meta_description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SEO için meta açıklama"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sayfa İçeriği
              </label>
              <textarea
                value={editData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Sayfa içeriğini girin (HTML desteklenir)"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`published-${editData.id}`}
                checked={editData.is_published}
                onChange={(e) => handleInputChange('is_published', e.target.checked)}
                className="rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor={`published-${editData.id}`} className="text-sm text-gray-700">
                Yayınlanmış
              </label>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => onSave(editData)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Kaydet
              </Button>
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={`${page.is_published ? 'border-green-200' : 'border-gray-200 opacity-75'}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{page.title}</CardTitle>
              <CardDescription className="mt-1">
                <span className="text-blue-600">/{page.slug}</span>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {page.is_published ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Yayınlanmış
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
              <Globe className="h-4 w-4 mr-2" />
              <span>URL: /{page.slug}</span>
            </div>
            {page.meta_description && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Meta:</span> {page.meta_description}
              </div>
            )}
            <div className="text-sm text-gray-600">
              <span className="font-medium">İçerik:</span> {page.content.substring(0, 100)}...
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(page)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Düzenle
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/${page.slug}`, '_blank')}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              Görüntüle
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(page.id)}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İçerik Sayfaları</h1>
          <p className="text-gray-600">Statik sayfaları yönetin</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Sayfa Ekle
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Sayfa ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Add New Page Form */}
      {showAddForm && (
        <Card className="border-blue-300">
          <CardHeader>
            <CardTitle className="text-blue-600">Yeni İçerik Sayfası Ekle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sayfa Başlığı
              </label>
              <input
                type="text"
                value={newPage.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setNewPage({ 
                    ...newPage, 
                    title,
                    slug: generateSlug(title)
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Sayfa başlığını girin"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={newPage.slug}
                onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="sayfa-url-slug"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Açıklama
              </label>
              <textarea
                value={newPage.meta_description}
                onChange={(e) => setNewPage({ ...newPage, meta_description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SEO için meta açıklama"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sayfa İçeriği
              </label>
              <textarea
                value={newPage.content}
                onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Sayfa içeriğini girin (HTML desteklenir)"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="new-published"
                checked={newPage.is_published}
                onChange={(e) => setNewPage({ ...newPage, is_published: e.target.checked })}
                className="rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="new-published" className="text-sm text-gray-700">
                Yayınlanmış
              </label>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => handleSave(newPage, true)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Kaydet
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="flex-1"
              >
                İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pages List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPages.map((page) => (
          <PageCard
            key={page.id}
            page={page}
            isEditing={editingPage?.id === page.id}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
        {filteredPages.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sayfa bulunamadı</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Arama kriterlerinize uygun sayfa bulunamadı.' : 'Henüz içerik sayfası eklenmemiş.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContentPagesAdmin;
