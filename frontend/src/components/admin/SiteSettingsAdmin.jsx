import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Save, 
  Upload, 
  Link, 
  Menu,
  Settings,
  Globe2,
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  ExternalLink
} from 'lucide-react';
import { API_CONFIG } from '../../config';

const SiteSettingsAdmin = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [siteSettings, setSiteSettings] = useState({
    site_title: 'Legal Design Turkey',
    site_description: 'Hukuki süreçleri görselleştiriyoruz',
    logo_url: '',
    favicon_url: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    social_links: {},
    ga_tracking_id: '',
    is_active: true
  });

  const [menuConfig, setMenuConfig] = useState({
    menu_items: [],
    header_buttons: [],
    is_active: true
  });

  const [footerConfig, setFooterConfig] = useState({
    footer_sections: [],
    copyright_text: '© 2024 Legal Design Turkey. Tüm hakları saklıdır.',
    is_active: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      
      // Fetch site settings
      const siteResponse = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/site-settings`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (siteResponse.ok) {
        const siteData = await siteResponse.json();
        setSiteSettings(siteData);
      }

      // Fetch menu config
      const menuResponse = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/menu-config`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (menuResponse.ok) {
        const menuData = await menuResponse.json();
        setMenuConfig(menuData);
      }

      // Fetch footer config
      const footerResponse = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/footer-config`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (footerResponse.ok) {
        const footerData = await footerResponse.json();
        setFooterConfig(footerData);
      }

    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSiteSettings = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/site-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(siteSettings),
      });

      if (response.ok) {
        alert('Site ayarları başarıyla kaydedildi!');
      } else {
        alert('Kaydetme işlemi başarısız!');
      }
    } catch (error) {
      console.error('Error saving site settings:', error);
      alert('Kaydetme hatası!');
    } finally {
      setSaving(false);
    }
  };

  const saveMenuConfig = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/menu-config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(menuConfig),
      });

      if (response.ok) {
        alert('Menü ayarları başarıyla kaydedildi!');
      } else {
        alert('Kaydetme işlemi başarısız!');
      }
    } catch (error) {
      console.error('Error saving menu config:', error);
      alert('Kaydetme hatası!');
    } finally {
      setSaving(false);
    }
  };

  const saveFooterConfig = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/footer-config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(footerConfig),
      });

      if (response.ok) {
        alert('Footer ayarları başarıyla kaydedildi!');
      } else {
        alert('Kaydetme işlemi başarısız!');
      }
    } catch (error) {
      console.error('Error saving footer config:', error);
      alert('Kaydetme hatası!');
    } finally {
      setSaving(false);
    }
  };

  const updateMenuItems = (newItems) => {
    setMenuConfig({...menuConfig, menu_items: newItems});
  };

  const addMenuItem = () => {
    const newItem = {
      label: 'Yeni Menü',
      url: '/',
      order: menuConfig.menu_items.length + 1,
      is_active: true
    };
    updateMenuItems([...menuConfig.menu_items, newItem]);
  };

  const removeMenuItem = (index) => {
    const newItems = menuConfig.menu_items.filter((_, i) => i !== index);
    updateMenuItems(newItems);
  };

  const moveMenuItem = (index, direction) => {
    const newItems = [...menuConfig.menu_items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newItems.length) {
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      updateMenuItems(newItems);
    }
  };

  const updateHeaderButtons = (newButtons) => {
    setMenuConfig({...menuConfig, header_buttons: newButtons});
  };

  const addHeaderButton = () => {
    const newButton = {
      label: 'Yeni Buton',
      url: '#',
      type: 'secondary',
      is_active: true
    };
    updateHeaderButtons([...menuConfig.header_buttons, newButton]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ayarlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'Genel Ayarlar', icon: Settings },
    { id: 'menu', label: 'Menü Yönetimi', icon: Menu },
    { id: 'footer', label: 'Footer Ayarları', icon: Link }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Ayarları</h1>
        <p className="text-gray-600">Site geneli ayarlarını yönetin</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <Card>
          <CardHeader>
            <CardTitle>Genel Site Ayarları</CardTitle>
            <CardDescription>Site başlığı, logo, iletişim bilgileri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe2 className="h-4 w-4 inline mr-1" />
                  Site Başlığı
                </label>
                <input
                  type="text"
                  value={siteSettings.site_title}
                  onChange={(e) => setSiteSettings({...siteSettings, site_title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Açıklaması
                </label>
                <input
                  type="text"
                  value={siteSettings.site_description}
                  onChange={(e) => setSiteSettings({...siteSettings, site_description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Upload className="h-4 w-4 inline mr-1" />
                  Logo URL
                </label>
                <input
                  type="url"
                  value={siteSettings.logo_url || ''}
                  onChange={(e) => setSiteSettings({...siteSettings, logo_url: e.target.value})}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favicon URL
                </label>
                <input
                  type="url"
                  value={siteSettings.favicon_url || ''}
                  onChange={(e) => setSiteSettings({...siteSettings, favicon_url: e.target.value})}
                  placeholder="https://example.com/favicon.ico"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  E-posta
                </label>
                <input
                  type="email"
                  value={siteSettings.contact_email || ''}
                  onChange={(e) => setSiteSettings({...siteSettings, contact_email: e.target.value})}
                  placeholder="info@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Telefon
                </label>
                <input
                  type="tel"
                  value={siteSettings.contact_phone || ''}
                  onChange={(e) => setSiteSettings({...siteSettings, contact_phone: e.target.value})}
                  placeholder="+90 XXX XXX XX XX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Adres
              </label>
              <textarea
                value={siteSettings.contact_address || ''}
                onChange={(e) => setSiteSettings({...siteSettings, contact_address: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Analytics Tracking ID
              </label>
              <input
                type="text"
                value={siteSettings.ga_tracking_id || ''}
                onChange={(e) => setSiteSettings({...siteSettings, ga_tracking_id: e.target.value})}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={saveSiteSettings}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu Management Tab */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          {/* Main Menu Items */}
          <Card>
            <CardHeader>
              <CardTitle>Ana Menü</CardTitle>
              <CardDescription>Header'da görünecek menü öğeleri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {menuConfig.menu_items.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => {
                        const newItems = [...menuConfig.menu_items];
                        newItems[index].label = e.target.value;
                        updateMenuItems(newItems);
                      }}
                      placeholder="Menu adı"
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => {
                        const newItems = [...menuConfig.menu_items];
                        newItems[index].url = e.target.value;
                        updateMenuItems(newItems);
                      }}
                      placeholder="URL (örn: /hakkimizda)"
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={item.is_active}
                          onChange={(e) => {
                            const newItems = [...menuConfig.menu_items];
                            newItems[index].is_active = e.target.checked;
                            updateMenuItems(newItems);
                          }}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm">Aktif</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveMenuItem(index, 'up')}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveMenuItem(index, 'down')}
                      disabled={index === menuConfig.menu_items.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeMenuItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button onClick={addMenuItem} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Menü Öğesi Ekle
              </Button>
            </CardContent>
          </Card>

          {/* Header Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Header Butonları</CardTitle>
              <CardDescription>Header'da görünecek özel butonlar (Adli Yardım, Beta gibi)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {menuConfig.header_buttons.map((button, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1 grid grid-cols-4 gap-3">
                    <input
                      type="text"
                      value={button.label}
                      onChange={(e) => {
                        const newButtons = [...menuConfig.header_buttons];
                        newButtons[index].label = e.target.value;
                        updateHeaderButtons(newButtons);
                      }}
                      placeholder="Buton metni"
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      value={button.url}
                      onChange={(e) => {
                        const newButtons = [...menuConfig.header_buttons];
                        newButtons[index].url = e.target.value;
                        updateHeaderButtons(newButtons);
                      }}
                      placeholder="URL"
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <select
                      value={button.type}
                      onChange={(e) => {
                        const newButtons = [...menuConfig.header_buttons];
                        newButtons[index].type = e.target.value;
                        updateHeaderButtons(newButtons);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                    </select>
                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={button.is_active}
                          onChange={(e) => {
                            const newButtons = [...menuConfig.header_buttons];
                            newButtons[index].is_active = e.target.checked;
                            updateHeaderButtons(newButtons);
                          }}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm">Aktif</span>
                      </label>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newButtons = menuConfig.header_buttons.filter((_, i) => i !== index);
                      updateHeaderButtons(newButtons);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button onClick={addHeaderButton} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Buton Ekle
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={saveMenuConfig}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Kaydediliyor...' : 'Menü Ayarlarını Kaydet'}
            </Button>
          </div>
        </div>
      )}

      {/* Footer Tab */}
      {activeTab === 'footer' && (
        <Card>
          <CardHeader>
            <CardTitle>Footer Ayarları</CardTitle>
            <CardDescription>Footer'da görünecek linkler ve telif hakkı metni</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telif Hakkı Metni
              </label>
              <input
                type="text"
                value={footerConfig.copyright_text}
                onChange={(e) => setFooterConfig({...footerConfig, copyright_text: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={saveFooterConfig}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Kaydediliyor...' : 'Footer Ayarlarını Kaydet'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SiteSettingsAdmin;