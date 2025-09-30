import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  Save, 
  Eye,
  FileText,
  Target,
  BarChart3,
  Sparkles,
  Link,
  Home,
  Plus,
  Trash2
} from 'lucide-react';
import { API_CONFIG } from '../../config';

const HomePageContentAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [contentData, setContentData] = useState({
    // Hero Section
    hero_title: 'Hukuki Süreçleri',
    hero_title_highlight: 'Görselleştiriyoruz',
    hero_subtitle: 'Karmaşık hukuki süreçleri anlaşılır görsellerle öğrenin. Vatandaşların hukuki haklarını öğrenmesi için tasarlanmış interaktif platform.',
    
    // CTA Buttons
    hero_primary_btn_text: 'Süreçleri Keşfedin',
    hero_primary_btn_url: '/hukuki-surecler',
    hero_secondary_btn_text: 'Ücretsiz Yardım Al',
    hero_secondary_btn_url: '/adli-yardim-hizmetleri',
    
    // Stats Section
    stats_processes_number: '8+',
    stats_processes_label: 'Hukuki Süreç',
    stats_processes_description: 'Boşanma, Miras, İş Davası ve daha fazlası',
    
    stats_steps_number: '35+',
    stats_steps_label: 'Detaylı Adım',
    stats_steps_description: 'Her süreç için kapsamlı açıklamalar',
    
    stats_free_number: '100%',
    stats_free_label: 'Ücretsiz',
    stats_free_description: 'Tüm içerikler tamamen ücretsiz',
    
    // Features Section
    features_title: 'Neden Legal Design Turkey?',
    features_description: 'Hukuki süreçleri herkesin anlayabileceği şekilde görselleştiriyoruz',
    features_items: [
      {
        icon: 'Smartphone',
        title: 'Mobil Uyumlu',
        description: 'Her cihazda kolayca kullanabileceğiniz responsive tasarım'
      },
      {
        icon: 'Scale',
        title: 'Görsel İçerik',
        description: 'Karmaşık hukuki süreçleri anlaşılır görsellerle öğrenin'
      },
      {
        icon: 'Users',
        title: 'Vatandaş Odaklı',
        description: 'Hukukçu olmayan vatandaşlar için tasarlandı'
      },
      {
        icon: 'BookOpen',
        title: 'Adım Adım Rehber',
        description: 'Her sürecin detaylı açıklaması ve yol haritası'
      }
    ],
    
    // Bottom CTA Section
    bottom_cta_title: 'Hukuki Süreçlerinizi Bugün Öğrenin',
    bottom_cta_description: 'Boşanma, miras, iş davası ve ceza yargılaması süreçlerini interaktif görsellerle keşfedin.',
    bottom_cta_primary_btn_text: 'Hemen Başlayın',
    bottom_cta_primary_btn_url: '/hukuki-surecler',
    bottom_cta_secondary_btn_text: 'Ücretsiz Yardım',
    bottom_cta_secondary_btn_url: '/adli-yardim-hizmetleri',
    
    is_active: true
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/home-page-content`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setContentData(data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/home-page-content?t=${Date.now()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify(contentData),
      });

      if (response.ok) {
        alert('İçerik başarıyla kaydedildi!');
        // Force refresh of page after save to clear any browser cache
        window.location.reload();
      } else {
        alert('Kaydetme işlemi başarısız!');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Kaydetme hatası!');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setContentData({ ...contentData, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">İçerik yükleniyor...</p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'hero', label: 'Hero Bölümü', icon: Home },
    { id: 'buttons', label: 'CTA Butonları', icon: Link },
    { id: 'stats', label: 'İstatistik Kartları', icon: BarChart3 },
    { id: 'features', label: 'Özellikler Bölümü', icon: Sparkles },
    { id: 'bottom-cta', label: 'Alt CTA Bölümü', icon: Target }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ana Sayfa İçeriği</h1>
          <p className="text-gray-600">Ana sayfadaki bölümleri düzenleyin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => window.open('/', '_blank')}
          >
            <Eye className="h-4 w-4 mr-2" />
            Önizle
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === section.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <section.icon className="h-4 w-4 mr-2" />
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Hero Section */}
      {activeSection === 'hero' && (
        <Card>
          <CardHeader>
            <CardTitle>Hero Bölümü</CardTitle>
            <CardDescription>Ana sayfa başlık ve alt başlık alanları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ana Başlık (İlk Kısım)
              </label>
              <input
                type="text"
                value={contentData.hero_title}
                onChange={(e) => updateField('hero_title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Hukuki Süreçleri"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ana Başlık (Vurgulanan Kısım)
              </label>
              <input
                type="text"
                value={contentData.hero_title_highlight}
                onChange={(e) => updateField('hero_title_highlight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Görselleştiriyoruz"
              />
              <p className="text-xs text-gray-500 mt-1">Bu kısım mavi renkle vurgulanır</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt Başlık
              </label>
              <textarea
                value={contentData.hero_subtitle}
                onChange={(e) => updateField('hero_subtitle', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Karmaşık hukuki süreçleri anlaşılır görsellerle öğrenin..."
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA Buttons Section */}
      {activeSection === 'buttons' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Birincil Buton</CardTitle>
              <CardDescription>Ana aksiyon butonu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buton Metni
                  </label>
                  <input
                    type="text"
                    value={contentData.hero_primary_btn_text}
                    onChange={(e) => updateField('hero_primary_btn_text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Süreçleri Keşfedin"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buton URL'si
                  </label>
                  <input
                    type="text"
                    value={contentData.hero_primary_btn_url}
                    onChange={(e) => updateField('hero_primary_btn_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="/hukuki-surecler"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>İkincil Buton</CardTitle>
              <CardDescription>Yardımcı aksiyon butonu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buton Metni
                  </label>
                  <input
                    type="text"
                    value={contentData.hero_secondary_btn_text}
                    onChange={(e) => updateField('hero_secondary_btn_text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Ücretsiz Yardım Al"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buton URL'si
                  </label>
                  <input
                    type="text"
                    value={contentData.hero_secondary_btn_url}
                    onChange={(e) => updateField('hero_secondary_btn_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="/adli-yardim"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Section */}
      {activeSection === 'stats' && (
        <Card>
          <CardHeader>
            <CardTitle>İstatistik Kartları</CardTitle>
            <CardDescription>Ana sayfada gösterilen 3 istatistik kartı</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hukuki Süreç Kartı */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium mb-3">1. Hukuki Süreç Kartı</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sayı
                  </label>
                  <input
                    type="text"
                    value={contentData.stats_processes_number}
                    onChange={(e) => updateField('stats_processes_number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="8+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık
                  </label>
                  <input
                    type="text"
                    value={contentData.stats_processes_label}
                    onChange={(e) => updateField('stats_processes_label', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Hukuki Süreç"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <input
                    type="text"
                    value={contentData.stats_processes_description}
                    onChange={(e) => updateField('stats_processes_description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Boşanma, Miras, İş Davası..."
                  />
                </div>
              </div>
            </div>

            {/* Detaylı Adım Kartı */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium mb-3">2. Detaylı Adım Kartı</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sayı
                  </label>
                  <input
                    type="text"
                    value={contentData.stats_steps_number}
                    onChange={(e) => updateField('stats_steps_number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="35+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık
                  </label>
                  <input
                    type="text"
                    value={contentData.stats_steps_label}
                    onChange={(e) => updateField('stats_steps_label', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Detaylı Adım"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <input
                    type="text"
                    value={contentData.stats_steps_description}
                    onChange={(e) => updateField('stats_steps_description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Her süreç için kapsamlı açıklamalar"
                  />
                </div>
              </div>
            </div>

            {/* Ücretsiz Kartı */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium mb-3">3. Ücretsiz Kartı</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sayı
                  </label>
                  <input
                    type="text"
                    value={contentData.stats_free_number}
                    onChange={(e) => updateField('stats_free_number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="100%"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık
                  </label>
                  <input
                    type="text"
                    value={contentData.stats_free_label}
                    onChange={(e) => updateField('stats_free_label', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Ücretsiz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <input
                    type="text"
                    value={contentData.stats_free_description}
                    onChange={(e) => updateField('stats_free_description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Tüm içerikler tamamen ücretsiz"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Section */}
      {activeSection === 'features' && (
        <Card>
          <CardHeader>
            <CardTitle>Özellikler Bölümü</CardTitle>
            <CardDescription>Ana sayfadaki özellik kartları ve başlık</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bölüm Başlığı
              </label>
              <input
                type="text"
                value={contentData.features_title}
                onChange={(e) => updateField('features_title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Neden Legal Design Turkey?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bölüm Açıklaması
              </label>
              <textarea
                value={contentData.features_description}
                onChange={(e) => updateField('features_description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Hukuki süreçleri herkesin anlayabileceği şekilde görselleştiriyoruz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Özellik Kartları
              </label>
              {contentData.features_items && contentData.features_items.map((item, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Özellik {index + 1}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newItems = contentData.features_items.filter((_, i) => i !== index);
                        updateField('features_items', newItems);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        İkon
                      </label>
                      <select
                        value={item.icon}
                        onChange={(e) => {
                          const newItems = [...contentData.features_items];
                          newItems[index].icon = e.target.value;
                          updateField('features_items', newItems);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="Smartphone">📱 Smartphone (Mobil)</option>
                        <option value="Scale">⚖️ Scale (Adalet)</option>
                        <option value="Users">👥 Users (Kullanıcılar)</option>
                        <option value="BookOpen">📖 BookOpen (Kitap)</option>
                        <option value="Shield">🛡️ Shield (Koruma)</option>
                        <option value="Clock">🕒 Clock (Zaman)</option>
                        <option value="Target">🎯 Target (Hedef)</option>
                        <option value="Award">🏆 Award (Ödül)</option>
                        <option value="Heart">❤️ Heart (Kalp)</option>
                        <option value="Lightbulb">💡 Lightbulb (Ampul)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Başlık
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...contentData.features_items];
                          newItems[index].title = e.target.value;
                          updateField('features_items', newItems);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Özellik başlığı"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Açıklama
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...contentData.features_items];
                          newItems[index].description = e.target.value;
                          updateField('features_items', newItems);
                        }}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Özellik açıklaması"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                onClick={() => {
                  const newItems = [...(contentData.features_items || []), {
                    icon: 'Smartphone',
                    title: 'Yeni Özellik',
                    description: 'Yeni özellik açıklaması'
                  }];
                  updateField('features_items', newItems);
                }}
                variant="outline" 
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Özellik Kartı Ekle
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom CTA Section */}
      {activeSection === 'bottom-cta' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alt CTA Bölümü</CardTitle>
              <CardDescription>Ana sayfanın alt kısmındaki call-to-action bölümü</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTA Başlığı
                </label>
                <input
                  type="text"
                  value={contentData.bottom_cta_title}
                  onChange={(e) => updateField('bottom_cta_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Hukuki Süreçlerinizi Bugün Öğrenin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTA Açıklaması
                </label>
                <textarea
                  value={contentData.bottom_cta_description}
                  onChange={(e) => updateField('bottom_cta_description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Boşanma, miras, iş davası ve ceza yargılaması süreçlerini interaktif görsellerle keşfedin."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CTA Butonları</CardTitle>
              <CardDescription>Alt CTA bölümündeki butonlar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birincil Buton Metni
                  </label>
                  <input
                    type="text"
                    value={contentData.bottom_cta_primary_btn_text}
                    onChange={(e) => updateField('bottom_cta_primary_btn_text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Hemen Başlayın"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birincil Buton URL'si
                  </label>
                  <input
                    type="text"
                    value={contentData.bottom_cta_primary_btn_url}
                    onChange={(e) => updateField('bottom_cta_primary_btn_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="/hukuki-surecler"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İkincil Buton Metni
                  </label>
                  <input
                    type="text"
                    value={contentData.bottom_cta_secondary_btn_text}
                    onChange={(e) => updateField('bottom_cta_secondary_btn_text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Ücretsiz Yardım"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İkincil Buton URL'si
                  </label>
                  <input
                    type="text"
                    value={contentData.bottom_cta_secondary_btn_url}
                    onChange={(e) => updateField('bottom_cta_secondary_btn_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="/adli-yardim-hizmetleri"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HomePageContentAdmin;