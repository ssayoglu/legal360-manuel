import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  FileText, 
  Calculator, 
  BookOpen, 
  Gavel, 
  Users, 
  MessageCircle,
  TrendingUp,
  Settings,
  PlusCircle,
  Edit,
  Eye,
  Trash2,
  Search,
  DollarSign,
  Scale
} from 'lucide-react';
import { API_CONFIG } from '../../config';

const AdminDashboard = ({ adminUser }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_processes: 0,
    total_blog_posts: 0,
    total_decisions: 0,
    total_visits: 0,
    calculator_usage: 0,
    compensation_calculations: 0,
    sentence_calculations: 0
  });
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDataTable, setShowDataTable] = useState(false);
  const [dataType, setDataType] = useState('processes');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Failed to fetch dashboard stats');
        // Default empty stats
        setStats({
          total_processes: 0,
          total_blog_posts: 0,
          total_decisions: 0,
          total_visits: 0,
          calculator_usage: 0,
          compensation_calculations: 0,
          sentence_calculations: 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Default empty stats
      setStats({
        total_processes: 0,
        total_blog_posts: 0,
        total_decisions: 0,
        total_visits: 0,
        calculator_usage: 0,
        compensation_calculations: 0,
        sentence_calculations: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMigration = async () => {
    if (!window.confirm('Frontend verilerini database\'e aktarmak istediğinizden emin misiniz? Bu işlem mevcut verilerle çakışma yaratabilir.')) {
      return;
    }

    setMigrating(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/migrate-frontend-data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Migration başarılı!\n\nEklenen:\n- ${result.results.legal_processes} hukuki süreç\n- ${result.results.calculator_parameters} hesaplayıcı parametresi\n- ${result.results.document_descriptions} belge açıklaması\n- ${result.results.blog_posts} blog yazısı\n\n${result.results.errors.length > 0 ? 'Hatalar: ' + result.results.errors.join(', ') : ''}`);
        // Refresh stats
        fetchDashboardStats();
      } else {
        const errorData = await response.json();
        alert('Migration başarısız: ' + errorData.detail);
      }
    } catch (error) {
      alert('Migration hatası: ' + error.message);
    } finally {
      setMigrating(false);
    }
  };

  const quickActions = [
    {
      title: 'Yeni Hukuki Süreç',
      description: 'Yeni bir hukuki süreç ekle',
      icon: FileText,
      color: 'bg-blue-500',
      href: '/admin/legal-processes/new'
    },
    {
      title: 'Blog Yazısı Ekle',
      description: 'Yeni blog yazısı oluştur',
      icon: BookOpen,
      color: 'bg-green-500',
      href: '/admin/blog-posts/new'
    },
    {
      title: 'Hesaplayıcı Ayarları',
      description: 'Hesaplayıcı parametrelerini düzenle',
      icon: Calculator,
      color: 'bg-purple-500',
      href: '/admin/calculator-parameters'
    },
    {
      title: 'Yargıtay Kararı',
      description: 'Yeni yargıtay kararı ekle',
      icon: Gavel,
      color: 'bg-orange-500',
      href: '/admin/supreme-court-decisions/new'
    }
  ];

  const managementSections = [
    {
      title: 'Hukuki Süreçler',
      description: 'Tüm hukuki süreçleri yönet',
      icon: FileText,
      count: stats.total_processes,
      href: '/admin/legal-processes',
      dataType: 'processes'
    },
    {
      title: 'Blog Yazıları',
      description: 'Blog içeriklerini yönet',
      icon: BookOpen,
      count: stats.total_blog_posts,
      href: '/admin/blog-posts',
      dataType: 'blog'
    },
    {
      title: 'Yargıtay Kararları',
      description: 'Yargıtay kararlarını yönet',
      icon: Gavel,
      count: stats.total_decisions,
      href: '/admin/supreme-court-decisions',
      dataType: 'decisions'
    },
    {
      title: 'İçerik Sayfaları',
      description: 'Statik sayfaları yönet',
      icon: MessageCircle,
      count: 0,
      href: '/admin/content-pages',
      dataType: 'content'
    }
  ];

  // Veri filtreleme fonksiyonları - API'den gelecek 
  const getFilteredData = () => {
    // Bu fonksiyon artık kullanılmıyor - gerçek CRUD sayfalarına yönlendiriliyor
    return [];
  };

  const handleViewData = (type) => {
    setDataType(type);
    setShowDataTable(true);
  };

  const handleEditItem = (item, type) => {
    console.log('Edit item:', item, 'Type:', type);
    // Düzenleme sayfasına yönlendir
    if (type === 'processes') {
      navigate(`/admin/legal-processes/${item.id}/edit`);
    } else if (type === 'blog') {
      navigate(`/admin/blog-posts/${item.id}/edit`);
    } else if (type === 'decisions') {
      navigate(`/admin/supreme-court-decisions/${item.id}/edit`);
    }
  };

  const handleDeleteItem = (item, type) => {
    if (window.confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
      console.log('Delete item:', item, 'Type:', type);
      // Silme işlemi burada yapılacak
      alert('Silme işlemi mock mode\'da çalışmıyor. Gerçek backend bağlantısı gerekli.');
    }
  };

  const getCategories = () => {
    // Bu fonksiyon artık kullanılmıyor - gerçek CRUD sayfalarına yönlendiriliyor
    return [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hoş geldiniz, {adminUser?.username}!
            </h1>
            <p className="text-gray-600 mt-2">
              Legal Design Turkey yönetim paneline hoş geldiniz. Buradan tüm içerikleri yönetebilirsiniz.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleMigration}
              disabled={migrating}
              className="bg-green-600 hover:bg-green-700"
            >
              {migrating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Migration yapılıyor...
                </>
              ) : (
                <>
                  📦 Frontend Verilerini Aktar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Süreç
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_processes}</div>
            <p className="text-xs text-muted-foreground">
              Hukuki süreç sayısı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Blog Yazıları
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_blog_posts}</div>
            <p className="text-xs text-muted-foreground">
              Yayınlanan blog yazısı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Yargıtay Kararları
            </CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_decisions}</div>
            <p className="text-xs text-muted-foreground">
              Kayıtlı karar sayısı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Ziyaret
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_visits}</div>
            <p className="text-xs text-muted-foreground">
              Site ziyaret sayısı
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calculator Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hesaplama Araçları Metrikleri</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Toplam Hesaplama
              </CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.calculator_usage}</div>
              <p className="text-xs text-muted-foreground">
                Tüm hesaplama araçları
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tazminat Hesaplama
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.compensation_calculations}</div>
              <p className="text-xs text-muted-foreground">
                İşçi hakları hesaplamaları
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                İnfaz Hesaplama
              </CardTitle>
              <Scale className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sentence_calculations}</div>
              <p className="text-xs text-muted-foreground">
                Ceza hukuku hesaplamaları
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(action.href)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                  <PlusCircle className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Management Sections */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">İçerik Yönetimi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {managementSections.map((section, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <section.icon className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle className="text-base">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{section.count}</div>
                    <p className="text-xs text-gray-500">toplam</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(section.href)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Yönet
                </Button>
                {section.dataType !== 'content' && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleViewData(section.dataType)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Verileri Görüntüle
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Data Table Modal */}
      {showDataTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {dataType === 'processes' && 'Hukuki Süreçler'}
                {dataType === 'blog' && 'Blog Yazıları'}
                {dataType === 'decisions' && 'Yargıtay Kararları'}
              </h3>
              <Button 
                variant="outline" 
                onClick={() => setShowDataTable(false)}
              >
                ✕ Kapat
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Kategoriler</option>
                {getCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Başlık</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Kategori</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      {dataType === 'blog' ? 'Yazar' : dataType === 'decisions' ? 'Daire' : 'Süre'}
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      {dataType === 'blog' ? 'Tarih' : dataType === 'decisions' ? 'Karar Tarihi' : 'Zorluk'}
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredData().map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="max-w-xs truncate">
                          {item.title || item.subject}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {item.category}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {dataType === 'blog' ? item.author : 
                         dataType === 'decisions' ? item.chamber : 
                         item.duration}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {dataType === 'blog' ? item.publishDate : 
                         dataType === 'decisions' ? item.decisionDate : 
                         item.difficulty}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditItem(item, dataType)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteItem(item, dataType)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Toplam {getFilteredData().length} öğe gösteriliyor
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;