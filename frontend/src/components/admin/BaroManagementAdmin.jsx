import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  MapPin,
  Phone,
  Globe,
  Save,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { API_CONFIG } from '../../config';

const BaroManagementAdmin = () => {
  const [baroContacts, setBaroContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllBaros, setShowAllBaros] = useState(false);
  const [visibleBaroCount, setVisibleBaroCount] = useState(10);

  useEffect(() => {
    fetchBaroContacts();
  }, []);

  const fetchBaroContacts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/legal-aid-info`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBaroContacts(data.baro_contacts || []);
      } else {
        console.error('Failed to fetch baro contacts');
        // Mock data fallback
        setBaroContacts([
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
        ]);
      }
    } catch (error) {
      console.error('Error fetching baro contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/admin/legal-aid-info`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baro_contacts: baroContacts
        }),
      });

      if (response.ok) {
        setEditing(false);
        alert('Baro bilgileri başarıyla güncellendi!');
        fetchBaroContacts();
      } else {
        console.error('Failed to save baro contacts');
        alert('Güncelleme sırasında bir hata oluştu.');
      }
    } catch (error) {
      console.error('Error saving baro contacts:', error);
      alert('Güncelleme sırasında bir hata oluştu.');
    }
  };

  const handleBaroChange = (index, field, value) => {
    const newBaroContacts = [...baroContacts];
    newBaroContacts[index] = {
      ...newBaroContacts[index],
      [field]: value
    };
    setBaroContacts(newBaroContacts);
  };

  const handleBaroAdd = () => {
    setBaroContacts([...baroContacts, {
      city: '',
      name: '',
      phone: '',
      address: '',
      website: ''
    }]);
  };

  const handleBaroRemove = (index) => {
    const newBaroContacts = baroContacts.filter((_, i) => i !== index);
    setBaroContacts(newBaroContacts);
  };

  // Filter and paginate baro contacts
  const filteredBaros = baroContacts.filter(baro => 
    baro?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    baro?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedBaros = showAllBaros ? filteredBaros : filteredBaros.slice(0, visibleBaroCount);
  const hasMoreBaros = filteredBaros.length > visibleBaroCount;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Baro bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Baro Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Türkiye'nin 81 ilindeki baro iletişim bilgilerini yönetin
          </p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Kaydet
              </Button>
              <Button onClick={() => setEditing(false)} variant="outline">
                <X className="h-4 w-4 mr-2" />
                İptal
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Düzenle
            </Button>
          )}
        </div>
      </div>

      {/* Search and Stats */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Baro Bilgileri
              </CardTitle>
              <CardDescription>
                Toplam {baroContacts.length} baro, {filteredBaros.length} sonuç
              </CardDescription>
            </div>
            
            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Şehir veya baro adı ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {displayedBaros.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedBaros.map((baro, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      {editing ? (
                        <Input
                          value={baro?.city || ''}
                          onChange={(e) => handleBaroChange(index, 'city', e.target.value)}
                          placeholder="Şehir"
                          className="font-semibold"
                        />
                      ) : (
                        <h3 className="text-lg font-semibold text-gray-900">{baro?.city || ''}</h3>
                      )}
                      <div className="flex items-center gap-2">
                        {editing ? (
                          <Input
                            value={baro?.name || ''}
                            onChange={(e) => handleBaroChange(index, 'name', e.target.value)}
                            placeholder="Baro Adı"
                            className="text-xs"
                          />
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            {baro?.name || ''}
                          </Badge>
                        )}
                        {editing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBaroRemove(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <Phone className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        {editing ? (
                          <Input
                            value={baro?.phone || ''}
                            onChange={(e) => handleBaroChange(index, 'phone', e.target.value)}
                            placeholder="Telefon"
                            className="text-xs"
                          />
                        ) : (
                          <span className="text-gray-700 font-medium">{baro?.phone || ''}</span>
                        )}
                      </div>
                      
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        {editing ? (
                          <Input
                            value={baro?.address || ''}
                            onChange={(e) => handleBaroChange(index, 'address', e.target.value)}
                            placeholder="Adres"
                            className="text-xs"
                          />
                        ) : (
                          <span className="text-gray-700">{baro?.address || ''}</span>
                        )}
                      </div>
                      
                      <div className="flex items-start">
                        <Globe className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        {editing ? (
                          <Input
                            value={baro?.website || ''}
                            onChange={(e) => handleBaroChange(index, 'website', e.target.value)}
                            placeholder="Website"
                            className="text-xs"
                          />
                        ) : baro?.website ? (
                          <a 
                            href={`https://${baro.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline text-xs"
                          >
                            {baro.website}
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">Website yok</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMoreBaros && !showAllBaros && (
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => setShowAllBaros(true)}
                    variant="outline"
                    className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  >
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Tüm Baroları Göster ({filteredBaros.length - visibleBaroCount} baro daha)
                  </Button>
                </div>
              )}
              
              {/* Show Less Button */}
              {showAllBaros && (
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => setShowAllBaros(false)}
                    variant="outline"
                    className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  >
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Daha Az Göster
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Arama sonucu bulunamadı</p>
              <p className="text-sm">Farklı bir arama terimi deneyin</p>
            </div>
          )}
          
          {/* Add New Baro Button */}
          {editing && (
            <div className="mt-6 text-center">
              <Button
                onClick={handleBaroAdd}
                variant="outline"
                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Baro Ekle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BaroManagementAdmin;
