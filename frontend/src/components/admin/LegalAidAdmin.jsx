import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Shield,
  Phone,
  MapPin,
  Clock,
  AlertCircle,
  FileText
} from 'lucide-react';
import { API_CONFIG } from '../../config';

const LegalAidAdmin = () => {
  const [legalAidInfo, setLegalAidInfo] = useState({
    title: '',
    description: '',
    sections: [],
    helplines: [],
    baroContacts: [],
    eligibility_criteria: '',
    application_process: '',
    required_documents: [],
    important_notes: [],
    contact_info: {
      phone: '',
      email: '',
      address: '',
      working_hours: ''
    },
    is_active: true
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchLegalAidInfo();
  }, []);

  const fetchLegalAidInfo = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/legal-aid-info`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Convert backend field names to frontend field names
        const frontendData = {
          ...data,
          baroContacts: data.baro_contacts || [],
          // Remove the backend field name
          baro_contacts: undefined
        };
        delete frontendData.baro_contacts;
        setLegalAidInfo(frontendData);
      } else {
        console.error('Failed to fetch legal aid info');
        // Mock data fallback
        setLegalAidInfo({
          title: 'Ücretsiz Adli Yardım Hizmetleri',
          description: 'Maddi durumu yetersiz olan vatandaşlarımızın hukuki sorunlarında ücretsiz destek alabileceği resmi hizmetler.',
          sections: [
            {
              icon: "Scale",
              title: "Adli Yardım Nedir?",
              content: "Maddi durumu yetersiz olan vatandaşların hukuki sorunlarında ücretsiz avukat desteği almasını sağlayan resmi hizmet. Barolar ve Adalet Bakanlığı tarafından yürütülür.",
              color: "bg-blue-100"
            },
            {
              icon: "Users",
              title: "Kimler Yararlanabilir?",
              content: "Gelir durumu belirli sınırların altında olan, maddi durumu yetersiz olan tüm vatandaşlar. Vatandaşlık şartı aranmaz, ikamet yeterlidir.",
              color: "bg-green-100"
            },
            {
              icon: "FileText",
              title: "Hangi Konularda Destek?",
              content: "Aile hukuku, iş hukuku, ceza hukuku, icra hukuku ve diğer tüm hukuki konularda ücretsiz danışmanlık ve dava takibi hizmeti.",
              color: "bg-purple-100"
            },
            {
              icon: "MessageCircle",
              title: "Nasıl Başvuru Yapılır?",
              content: "En yakın baroya giderek başvuru formu doldurulur. Gelir belgesi ve kimlik belgesi ile birlikte başvuru yapılabilir.",
              color: "bg-orange-100"
            }
          ],
          helplines: [
            {
              name: "Adli Yardım Hattı",
              phone: "175",
              hours: "7/24",
              description: "Acil durumlar için ücretsiz danışmanlık"
            },
            {
              name: "Baro Adli Yardım",
              phone: "444 0 175",
              hours: "09:00-17:00",
              description: "Detaylı bilgi ve randevu alma"
            },
            {
              name: "Kadın Destek Hattı",
              phone: "444 0 186",
              hours: "7/24",
              description: "Kadın hakları ve şiddet mağdurları"
            }
          ],
          baroContacts: [
            {
              city: "İstanbul",
              name: "İstanbul Barosu",
              phone: "0212 251 66 00",
              address: "Cağaloğlu, İstanbul",
              website: "www.istanbulbarosu.org.tr"
            },
            {
              city: "Ankara",
              name: "Ankara Barosu",
              phone: "0312 311 20 00",
              address: "Kızılay, Ankara",
              website: "www.ankarabarosu.org.tr"
            },
            {
              city: "İzmir",
              name: "İzmir Barosu",
              phone: "0232 441 77 00",
              address: "Konak, İzmir",
              website: "www.izmirbarosu.org.tr"
            }
          ],
          eligibility_criteria: 'Adli yardımdan yararlanabilmek için gelir durumunuzun belirli sınırlar içinde olması gerekmektedir.',
          application_process: '1. Başvuru formunu doldurun\n2. Gerekli belgeleri hazırlayın\n3. En yakın adli yardım bürosuna başvurun',
          required_documents: [
            'Kimlik belgesi',
            'Gelir belgesi',
            'Dava dosyası',
            'Adli yardım başvuru formu'
          ],
          contact_info: {
            phone: '444 0 123',
            email: 'adliyardim@adalet.gov.tr',
            address: 'Adalet Bakanlığı, Adli Yardım Genel Müdürlüğü',
            working_hours: 'Pazartesi-Cuma: 09:00-17:00'
          },
          is_active: true
        });
      }
    } catch (error) {
      console.error('Error fetching legal aid info:', error);
      // Mock data fallback
      setLegalAidInfo({
        title: 'Ücretsiz Adli Yardım Hizmetleri',
        description: 'Maddi durumu yetersiz olan vatandaşlarımızın hukuki sorunlarında ücretsiz destek alabileceği resmi hizmetler.',
        sections: [
          {
            icon: "Scale",
            title: "Adli Yardım Nedir?",
            content: "Maddi durumu yetersiz olan vatandaşların hukuki sorunlarında ücretsiz avukat desteği almasını sağlayan resmi hizmet. Barolar ve Adalet Bakanlığı tarafından yürütülür.",
            color: "bg-blue-100"
          },
          {
            icon: "Users",
            title: "Kimler Yararlanabilir?",
            content: "Gelir durumu belirli sınırların altında olan, maddi durumu yetersiz olan tüm vatandaşlar. Vatandaşlık şartı aranmaz, ikamet yeterlidir.",
            color: "bg-green-100"
          },
          {
            icon: "FileText",
            title: "Hangi Konularda Destek?",
            content: "Aile hukuku, iş hukuku, ceza hukuku, icra hukuku ve diğer tüm hukuki konularda ücretsiz danışmanlık ve dava takibi hizmeti.",
            color: "bg-purple-100"
          },
          {
            icon: "MessageCircle",
            title: "Nasıl Başvuru Yapılır?",
            content: "En yakın baroya giderek başvuru formu doldurulur. Gelir belgesi ve kimlik belgesi ile birlikte başvuru yapılabilir.",
            color: "bg-orange-100"
          }
        ],
        helplines: [
          {
            name: "Adli Yardım Hattı",
            phone: "175",
            hours: "7/24",
            description: "Acil durumlar için ücretsiz danışmanlık"
          },
          {
            name: "Baro Adli Yardım",
            phone: "444 0 175",
            hours: "09:00-17:00",
            description: "Detaylı bilgi ve randevu alma"
          },
          {
            name: "Kadın Destek Hattı",
            phone: "444 0 186",
            hours: "7/24",
            description: "Kadın hakları ve şiddet mağdurları"
          }
        ],
        baroContacts: [
          {
            city: "İstanbul",
            name: "İstanbul Barosu",
            phone: "0212 251 66 00",
            address: "Cağaloğlu, İstanbul",
            website: "www.istanbulbarosu.org.tr"
          },
          {
            city: "Ankara",
            name: "Ankara Barosu",
            phone: "0312 311 20 00",
            address: "Kızılay, Ankara",
            website: "www.ankarabarosu.org.tr"
          },
          {
            city: "İzmir",
            name: "İzmir Barosu",
            phone: "0232 441 77 00",
            address: "Konak, İzmir",
            website: "www.izmirbarosu.org.tr"
          }
        ],
        eligibility_criteria: 'Adli yardımdan yararlanabilmek için gelir durumunuzun belirli sınırlar içinde olması gerekmektedir.',
        application_process: '1. Başvuru formunu doldurun\n2. Gerekli belgeleri hazırlayın\n3. En yakın adli yardım bürosuna başvurun',
        required_documents: [
          'Kimlik belgesi',
          'Gelir belgesi',
          'Dava dosyası',
          'Adli yardım başvuru formu'
        ],
        contact_info: {
          phone: '444 0 123',
          email: 'adliyardim@adalet.gov.tr',
          address: 'Adalet Bakanlığı, Adli Yardım Genel Müdürlüğü',
          working_hours: 'Pazartesi-Cuma: 09:00-17:00'
        },
        is_active: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      
      // Convert frontend field names to backend field names
      const backendData = {
        ...legalAidInfo,
        baro_contacts: legalAidInfo.baroContacts,
        required_documents: legalAidInfo.required_documents || [],
        important_notes: legalAidInfo.important_notes || [],
        // Remove the frontend field name
        baroContacts: undefined
      };
      delete backendData.baroContacts;
      
      console.log('Sending data to backend:', backendData); // Debug log
      
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/legal-aid-info`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (response.ok) {
        setEditing(false);
        alert('Adli yardım bilgileri başarıyla güncellendi!');
        // Refresh the data after successful update
        fetchLegalAidInfo();
      } else {
        console.error('Failed to save legal aid info');
        alert('Güncelleme sırasında bir hata oluştu.');
      }
    } catch (error) {
      console.error('Error saving legal aid info:', error);
      alert('Güncelleme sırasında bir hata oluştu.');
    }
  };

  const handleInputChange = (field, value) => {
    setLegalAidInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactInfoChange = (field, value) => {
    setLegalAidInfo(prev => ({
      ...prev,
      contact_info: {
        ...prev.contact_info,
        [field]: value
      }
    }));
  };

  const handleDocumentAdd = () => {
    setLegalAidInfo(prev => ({
      ...prev,
      required_documents: [...(prev.required_documents || []), '']
    }));
  };

  const handleDocumentChange = (index, value) => {
    setLegalAidInfo(prev => ({
      ...prev,
      required_documents: (prev.required_documents || []).map((doc, i) => 
        i === index ? value : doc
      )
    }));
  };

  const handleDocumentRemove = (index) => {
    setLegalAidInfo(prev => ({
      ...prev,
      required_documents: (prev.required_documents || []).filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Adli yardım bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Adli Yardım Yönetimi</h1>
          <p className="text-gray-600">Adli yardım sayfasındaki tüm bilgileri düzenleyin</p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                Kaydet
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditing(false)}
              >
                İptal
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setEditing(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Düzenle
            </Button>
          )}
        </div>
      </div>

      {/* Sections Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Bilgi Bölümleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {legalAidInfo.sections?.map((section, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Başlık
                    </label>
                    <input
                      type="text"
                      value={section?.title || ''}
                      onChange={(e) => {
                        const newSections = [...(legalAidInfo.sections || [])];
                        newSections[index] = { ...newSections[index], title: e.target.value };
                        setLegalAidInfo(prev => ({ ...prev, sections: newSections }));
                      }}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      İkon
                    </label>
                    <select
                      value={section?.icon || ''}
                      onChange={(e) => {
                        const newSections = [...(legalAidInfo.sections || [])];
                        newSections[index] = { ...newSections[index], icon: e.target.value };
                        setLegalAidInfo(prev => ({ ...prev, sections: newSections }));
                      }}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="Scale">Terazi</option>
                      <option value="Users">Kullanıcılar</option>
                      <option value="FileText">Dosya</option>
                      <option value="MessageCircle">Mesaj</option>
                      <option value="Phone">Telefon</option>
                      <option value="MapPin">Konum</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      İçerik
                    </label>
                    <textarea
                      value={section?.content || ''}
                      onChange={(e) => {
                        const newSections = [...(legalAidInfo.sections || [])];
                        newSections[index] = { ...newSections[index], content: e.target.value };
                        setLegalAidInfo(prev => ({ ...prev, sections: newSections }));
                      }}
                      disabled={!editing}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>
                {editing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newSections = (legalAidInfo.sections || []).filter((_, i) => i !== index);
                      setLegalAidInfo(prev => ({ ...prev, sections: newSections }));
                    }}
                    className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Bölümü Sil
                  </Button>
                )}
              </div>
            ))}
            {editing && (
              <Button
                variant="outline"
                onClick={() => {
                  const newSections = [...(legalAidInfo.sections || []), {
                    icon: "FileText",
                    title: "Yeni Bölüm",
                    content: "Bölüm içeriği...",
                    color: "bg-gray-100"
                  }];
                  setLegalAidInfo(prev => ({ ...prev, sections: newSections }));
                }}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Bölüm Ekle
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Helplines Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            Yardım Hatları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {legalAidInfo.helplines?.map((helpline, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hattın Adı
                    </label>
                    <input
                      type="text"
                      value={helpline?.name || ''}
                      onChange={(e) => {
                        const newHelplines = [...(legalAidInfo.helplines || [])];
                        newHelplines[index] = { ...newHelplines[index], name: e.target.value };
                        setLegalAidInfo(prev => ({ ...prev, helplines: newHelplines }));
                      }}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <input
                      type="text"
                      value={helpline?.phone || ''}
                      onChange={(e) => {
                        const newHelplines = [...(legalAidInfo.helplines || [])];
                        newHelplines[index] = { ...newHelplines[index], phone: e.target.value };
                        setLegalAidInfo(prev => ({ ...prev, helplines: newHelplines }));
                      }}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Çalışma Saatleri
                    </label>
                    <input
                      type="text"
                      value={helpline?.hours || ''}
                      onChange={(e) => {
                        const newHelplines = [...(legalAidInfo.helplines || [])];
                        newHelplines[index] = { ...newHelplines[index], hours: e.target.value };
                        setLegalAidInfo(prev => ({ ...prev, helplines: newHelplines }));
                      }}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Açıklama
                    </label>
                    <input
                      type="text"
                      value={helpline?.description || ''}
                      onChange={(e) => {
                        const newHelplines = [...(legalAidInfo.helplines || [])];
                        newHelplines[index] = { ...newHelplines[index], description: e.target.value };
                        setLegalAidInfo(prev => ({ ...prev, helplines: newHelplines }));
                      }}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>
                {editing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newHelplines = (legalAidInfo.helplines || []).filter((_, i) => i !== index);
                      setLegalAidInfo(prev => ({ ...prev, helplines: newHelplines }));
                    }}
                    className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Hattı Sil
                  </Button>
                )}
              </div>
            ))}
            {editing && (
              <Button
                variant="outline"
                onClick={() => {
                  const newHelplines = [...(legalAidInfo.helplines || []), {
                    name: "Yeni Yardım Hattı",
                    phone: "",
                    hours: "",
                    description: ""
                  }];
                  setLegalAidInfo(prev => ({ ...prev, helplines: newHelplines }));
                }}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yardım Hattı Ekle
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Baro Management Link */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Baro Yönetimi</h3>
                <p className="text-blue-700 text-sm">
                  Baro iletişim bilgilerini yönetmek için ayrı sayfaya gidin
                </p>
              </div>
            </div>
            <Button
              onClick={() => window.location.href = '/admin/baro-management'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Baro Yönetimine Git
            </Button>
          </div>
        </CardContent>
      </Card>


      {/* Required Documents - Modern Design */}
      <Card className="mt-8">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center text-xl">
            <FileText className="h-6 w-6 mr-3 text-blue-600" />
            <span className="text-gray-800">Gerekli Belgeler</span>
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Başvuru sırasında sunulması gereken belgeleri yönetin
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {legalAidInfo.required_documents?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {legalAidInfo.required_documents?.map((doc, index) => (
                  <div key={index} className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={doc || ''}
                          onChange={(e) => handleDocumentChange(index, e.target.value)}
                          disabled={!editing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-700 font-medium"
                          placeholder="Belge adını girin"
                        />
                      </div>
                      {editing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDocumentRemove(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Henüz belge eklenmemiş</p>
                <p className="text-sm">Başvuru için gerekli belgeleri ekleyin</p>
              </div>
            )}
            
            {editing && (
              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleDocumentAdd}
                  className="w-full md:w-auto bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Belge Ekle
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
            Önemli Bilgiler
          </CardTitle>
          <CardDescription>Public sayfadaki "Önemli Bilgiler" bölümünü buradan yönetin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(legalAidInfo.important_notes || []).map((note, index) => (
              <div key={index} className="flex items-start gap-2">
                <input
                  type="text"
                  value={note || ''}
                  onChange={(e) => {
                    const list = [...(legalAidInfo.important_notes || [])];
                    list[index] = e.target.value;
                    setLegalAidInfo(prev => ({ ...prev, important_notes: list }));
                  }}
                  disabled={!editing}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Önemli not girin"
                />
                {editing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const list = (legalAidInfo.important_notes || []).filter((_, i) => i !== index);
                      setLegalAidInfo(prev => ({ ...prev, important_notes: list }));
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {editing && (
              <Button
                variant="outline"
                onClick={() => setLegalAidInfo(prev => ({ ...prev, important_notes: [...(prev.important_notes || []), ''] }))}
              >
                <Plus className="h-4 w-4 mr-2" /> Not Ekle
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Durum</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={legalAidInfo.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              disabled={!editing}
              className="rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Adli yardım sayfası aktif
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalAidAdmin;
