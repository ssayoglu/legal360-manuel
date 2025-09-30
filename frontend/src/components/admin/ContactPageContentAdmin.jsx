import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  Save, 
  Eye,
  FileText,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  HelpCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { API_CONFIG } from '../../config';

const ContactPageContentAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [contentData, setContentData] = useState({
    hero_title: 'İletişim',
    hero_description: 'Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçin. Size yardımcı olmaktan mutluluk duyarız.',
    contact_email: 'info@legaldesignturkey.com',
    contact_phone: '0212 XXX XX XX',
    contact_address: 'İstanbul, Türkiye',
    office_hours: 'Pazartesi - Cuma, 09:00 - 18:00',
    contact_form_title: 'Bize Mesaj Gönderin',
    contact_form_description: 'Aşağıdaki formu doldurarak bizimle iletişime geçebilirsiniz.',
    faq_title: 'Sık Sorulan Sorular',
    faq_description: 'En çok merak edilen sorular ve cevapları',
    faq_items: [
      {
        question: 'Platform tamamen ücretsiz mi?',
        answer: 'Evet, Legal Design Turkey platformundaki tüm içerikler tamamen ücretsizdir. Amacımız hukuki bilgilere herkesin eşit erişimini sağlamaktır.'
      },
      {
        question: 'Verdiğiniz bilgiler hukuki tavsiye niteliğinde mi?',
        answer: 'Hayır, platformumuz sadece bilgilendirme amaçlıdır. Kesin hukuki tavsiye için mutlaka bir avukatla görüşmelisiniz.'
      },
      {
        question: 'Yeni süreçler ekleniyor mu?',
        answer: 'Evet, sürekli olarak yeni hukuki süreçler ekliyoruz. Blog sayfamızdan güncellemeleri takip edebilirsiniz.'
      },
      {
        question: 'Mobil uygulamanız var mı?',
        answer: 'Şu anda web sitesi tamamen mobile uyumlu. Yakın gelecekte mobil uygulama geliştirmeyi planlıyoruz.'
      }
    ],
    is_active: true
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/contact-page-content`, {
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
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/contact-page-content`, {
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
    { id: 'contact-info', label: 'İletişim Bilgileri', icon: Mail },
    { id: 'contact-form', label: 'İletişim Formu', icon: MessageSquare },
    { id: 'faq', label: 'Sık Sorulan Sorular', icon: HelpCircle }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İletişim Sayfası İçeriği</h1>
          <p className="text-gray-600">İletişim sayfasındaki bölümleri düzenleyin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => window.open('/iletisim', '_blank')}
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
                Sayfa Başlığı
              </label>
              <input
                type="text"
                value={contentData.hero_title}
                onChange={(e) => updateField('hero_title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="İletişim"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sayfa Açıklaması
              </label>
              <textarea
                value={contentData.hero_description}
                onChange={(e) => updateField('hero_description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçin..."
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Info Section */}
      {activeSection === 'contact-info' && (
        <Card>
          <CardHeader>
            <CardTitle>İletişim Bilgileri</CardTitle>
            <CardDescription>4 kutucuk içinde gösterilen iletişim bilgileri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  value={contentData.contact_email}
                  onChange={(e) => updateField('contact_email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="info@legaldesignturkey.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Telefon Numarası
                </label>
                <input
                  type="tel"
                  value={contentData.contact_phone}
                  onChange={(e) => updateField('contact_phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="0212 XXX XX XX"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Adres Bilgisi
              </label>
              <textarea
                value={contentData.contact_address}
                onChange={(e) => updateField('contact_address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="İstanbul, Türkiye"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Çalışma Saatleri
              </label>
              <input
                type="text"
                value={contentData.office_hours}
                onChange={(e) => updateField('office_hours', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Pazartesi - Cuma, 09:00 - 18:00"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Form Section */}
      {activeSection === 'contact-form' && (
        <Card>
          <CardHeader>
            <CardTitle>İletişim Formu</CardTitle>
            <CardDescription>İletişim formu başlığı ve açıklaması</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Başlığı
              </label>
              <input
                type="text"
                value={contentData.contact_form_title}
                onChange={(e) => updateField('contact_form_title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Bize Mesaj Gönderin"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Açıklaması
              </label>
              <textarea
                value={contentData.contact_form_description}
                onChange={(e) => updateField('contact_form_description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Aşağıdaki formu doldurarak bizimle iletişime geçebilirsiniz."
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ Section */}
      {activeSection === 'faq' && (
        <Card>
          <CardHeader>
            <CardTitle>Sık Sorulan Sorular</CardTitle>
            <CardDescription>FAQ başlığı, açıklaması ve soru-cevap listesi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FAQ Başlığı
              </label>
              <input
                type="text"
                value={contentData.faq_title}
                onChange={(e) => updateField('faq_title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Sık Sorulan Sorular"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FAQ Açıklaması
              </label>
              <textarea
                value={contentData.faq_description}
                onChange={(e) => updateField('faq_description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="En çok merak edilen sorular ve cevapları"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FAQ Öğeleri
              </label>
              {contentData.faq_items && contentData.faq_items.map((item, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Soru {index + 1}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newItems = contentData.faq_items.filter((_, i) => i !== index);
                        updateField('faq_items', newItems);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Soru
                      </label>
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => {
                          const newItems = [...contentData.faq_items];
                          newItems[index].question = e.target.value;
                          updateField('faq_items', newItems);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Soru metni"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cevap
                      </label>
                      <textarea
                        value={item.answer}
                        onChange={(e) => {
                          const newItems = [...contentData.faq_items];
                          newItems[index].answer = e.target.value;
                          updateField('faq_items', newItems);
                        }}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Cevap metni"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                onClick={() => {
                  const newItems = [...(contentData.faq_items || []), {
                    question: 'Yeni soru',
                    answer: 'Yeni cevap'
                  }];
                  updateField('faq_items', newItems);
                }}
                variant="outline" 
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni FAQ Öğesi Ekle
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContactPageContentAdmin;