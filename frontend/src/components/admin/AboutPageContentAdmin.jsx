import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  Save, 
  Edit, 
  Eye,
  FileText,
  Target,
  Lightbulb,
  Users,
  Plus,
  Trash2,
  Award,
  Heart
} from 'lucide-react';
import { API_CONFIG } from '../../config';

const AboutPageContentAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [contentData, setContentData] = useState({
    hero_title: '',
    hero_description: '',
    mission_title: '',
    mission_description: '',
    vision_title: '',
    vision_description: '',
    values: [],
    team_members: [],
    is_active: true
  });

  const iconOptions = [
    { value: 'Users', label: 'Kullanıcılar', icon: Users },
    { value: 'Lightbulb', label: 'Ampul', icon: Lightbulb },
    { value: 'Heart', label: 'Kalp', icon: Heart },
    { value: 'Award', label: 'Ödül', icon: Award },
    { value: 'Target', label: 'Hedef', icon: Target },
    { value: 'FileText', label: 'Dosya', icon: FileText }
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/about-page-content`, {
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
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/about-page-content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(contentData),
      });

      if (response.ok) {
        alert('İçerik başarıyla kaydedildi!');
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

  const addValue = () => {
    const newValue = {
      title: 'Yeni Değer',
      description: 'Değer açıklaması',
      icon: 'Users'
    };
    setContentData({
      ...contentData,
      values: [...contentData.values, newValue]
    });
  };

  const updateValue = (index, field, value) => {
    const updatedValues = [...contentData.values];
    updatedValues[index][field] = value;
    setContentData({ ...contentData, values: updatedValues });
  };

  const removeValue = (index) => {
    const updatedValues = contentData.values.filter((_, i) => i !== index);
    setContentData({ ...contentData, values: updatedValues });
  };

  const addTeamMember = () => {
    const newMember = {
      name: 'Yeni Üye',
      role: 'Pozisyon',
      description: 'Kısa açıklama'
    };
    setContentData({
      ...contentData,
      team_members: [...contentData.team_members, newMember]
    });
  };

  const updateTeamMember = (index, field, value) => {
    const updatedMembers = [...contentData.team_members];
    updatedMembers[index][field] = value;
    setContentData({ ...contentData, team_members: updatedMembers });
  };

  const removeTeamMember = (index) => {
    const updatedMembers = contentData.team_members.filter((_, i) => i !== index);
    setContentData({ ...contentData, team_members: updatedMembers });
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
    { id: 'hero', label: 'Hero Bölümü', icon: FileText },
    { id: 'mission', label: 'Misyon & Vizyon', icon: Target },
    { id: 'values', label: 'Değerlerimiz', icon: Award },
    { id: 'team', label: 'Ekibimiz', icon: Users }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hakkımızda Sayfası İçeriği</h1>
          <p className="text-gray-600">Hakkımızda sayfasındaki bölümleri düzenleyin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => window.open('/hakkimizda', '_blank')}
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
            <CardDescription>Ana başlık ve açıklama metni</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ana Başlık
              </label>
              <input
                type="text"
                value={contentData.hero_title}
                onChange={(e) => updateField('hero_title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Hakkımızda"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama Metni
              </label>
              <textarea
                value={contentData.hero_description}
                onChange={(e) => updateField('hero_description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Legal Design Turkey olarak..."
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mission & Vision Section */}
      {activeSection === 'mission' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Misyon</CardTitle>
              <CardDescription>Misyon başlığı ve açıklaması</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Misyon Başlığı
                </label>
                <input
                  type="text"
                  value={contentData.mission_title}
                  onChange={(e) => updateField('mission_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Misyonumuz"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Misyon Açıklaması
                </label>
                <textarea
                  value={contentData.mission_description}
                  onChange={(e) => updateField('mission_description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Hukuki süreçleri görselleştirerek..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vizyon</CardTitle>
              <CardDescription>Vizyon başlığı ve açıklaması</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vizyon Başlığı
                </label>
                <input
                  type="text"
                  value={contentData.vision_title}
                  onChange={(e) => updateField('vision_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Vizyonumuz"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vizyon Açıklaması
                </label>
                <textarea
                  value={contentData.vision_description}
                  onChange={(e) => updateField('vision_description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Türkiye'de hukuki bilgilere erişimde..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Values Section */}
      {activeSection === 'values' && (
        <Card>
          <CardHeader>
            <CardTitle>Değerlerimiz</CardTitle>
            <CardDescription>Şirket değerleri ve açıklamaları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contentData.values.map((value, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Değer {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeValue(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Başlık
                    </label>
                    <input
                      type="text"
                      value={value.title}
                      onChange={(e) => updateValue(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Değer adı"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      İkon
                    </label>
                    <select
                      value={value.icon}
                      onChange={(e) => updateValue(index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {iconOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Açıklama
                    </label>
                    <textarea
                      value={value.description}
                      onChange={(e) => updateValue(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Değer açıklaması"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button onClick={addValue} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Değer Ekle
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Team Section */}
      {activeSection === 'team' && (
        <Card>
          <CardHeader>
            <CardTitle>Ekibimiz</CardTitle>
            <CardDescription>Takım üyeleri bilgileri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contentData.team_members.map((member, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Üye {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeTeamMember(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      İsim
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Ad Soyad"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pozisyon
                    </label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Unvan/Pozisyon"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Açıklama
                    </label>
                    <textarea
                      value={member.description}
                      onChange={(e) => updateTeamMember(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Kısa açıklama"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button onClick={addTeamMember} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Üye Ekle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AboutPageContentAdmin;